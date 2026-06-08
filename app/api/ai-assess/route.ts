import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { candidate_id, job_description, candidate_info } = body

  if (!candidate_id || !candidate_info) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const prompt = `You are an expert recruiter. Evaluate this candidate for the job.

JOB DESCRIPTION:
${job_description || 'No specific job description provided.'}

CANDIDATE PROFILE:
Name: ${candidate_info.full_name}
Current Position: ${candidate_info.current_position || 'Not specified'}
Current Company: ${candidate_info.current_company || 'Not specified'}
Years of Experience: ${candidate_info.years_experience || 'Not specified'}
Skills: ${candidate_info.skills?.join(', ') || 'Not specified'}
LinkedIn: ${candidate_info.linkedin_url || 'Not provided'}
Notes: ${candidate_info.notes || 'None'}

Respond ONLY with a JSON object, no markdown, no explanation:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "recommendation": "<one of: strong_yes, yes, maybe, no>",
  "experience_match": <number 0-100>,
  "skills_match": <number 0-100>,
  "assessed_at": "${new Date().toISOString()}"
}`

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      const fallback = generateFallbackAssessment(candidate_info)
      await saveAssessment(candidate_id, fallback, user.id)
      return NextResponse.json({ assessment: fallback, source: 'fallback' })
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek error:', err)
      // Fall back to rule-based scoring
      const fallback = generateFallbackAssessment(candidate_info)
      await saveAssessment(candidate_id, fallback, user.id)
      return NextResponse.json({ assessment: fallback, source: 'fallback' })
    }

    const aiData = await response.json()
    const content = aiData.choices?.[0]?.message?.content || ''

    let assessment
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      assessment = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse AI response:', content)
      const fallback = generateFallbackAssessment(candidate_info)
      await saveAssessment(candidate_id, fallback, user.id)
      return NextResponse.json({ assessment: fallback, source: 'fallback' })
    }

    await saveAssessment(candidate_id, assessment, user.id)
    return NextResponse.json({ assessment, source: 'deepseek' })

  } catch (error) {
    console.error('AI Assessment error:', error)
    const fallback = generateFallbackAssessment(candidate_info)
    await saveAssessment(candidate_id, fallback, user.id)
    return NextResponse.json({ assessment: fallback, source: 'fallback' })
  }
}

async function saveAssessment(
  candidateId: string,
  assessment: Record<string, unknown>,
  userId: string
) {
  const adminSupabase = createAdminClient()

  await adminSupabase
    .from('candidates')
    .update({
      ai_score: assessment.score,
      ai_assessment: assessment,
    })
    .eq('id', candidateId)

  await adminSupabase
    .from('activities')
    .insert({
      candidate_id: candidateId,
      owner_id: userId,
      type: 'ai_assessment',
      content: `AI assessment completed. Score: ${assessment.score}/100`,
      metadata: {
        score: assessment.score,
        recommendation: assessment.recommendation,
      },
    })
}

function generateFallbackAssessment(candidateInfo: Record<string, unknown>) {
  const yearsExp   = (candidateInfo.years_experience as number) || 0
  const skillCount = (candidateInfo.skills as string[] | null)?.length || 0
  const hasLinkedIn = !!candidateInfo.linkedin_url
  const hasPosition = !!candidateInfo.current_position

  const score = Math.min(
    Math.round(
      40 +
      yearsExp * 4 +
      skillCount * 3 +
      (hasLinkedIn ? 8 : 0) +
      (hasPosition ? 6 : 0) +
      (Math.random() * 10 - 5)
    ),
    95
  )

  const recommendation =
    score >= 80 ? 'strong_yes' :
    score >= 65 ? 'yes' :
    score >= 50 ? 'maybe' : 'no'

  const skills = (candidateInfo.skills as string[]) || []

  return {
    score,
    summary: `${candidateInfo.full_name} brings ${yearsExp > 0 ? `${yearsExp} years of experience` : 'relevant background'}${candidateInfo.current_position ? ` as ${candidateInfo.current_position}` : ''}. Profile shows ${score >= 70 ? 'strong' : 'moderate'} alignment with requirements.${hasLinkedIn ? ' LinkedIn profile available for deeper review.' : ''}`,
    strengths: [
      yearsExp >= 3
        ? `${yearsExp}+ years of relevant experience`
        : 'Emerging professional with growth potential',
      skillCount > 0
        ? `Proficiency in ${skills.slice(0, 2).join(' and ')}`
        : 'Motivated to apply',
      hasLinkedIn
        ? 'Transparent professional profile on LinkedIn'
        : 'Direct application shows initiative',
    ],
    gaps: [
      !candidateInfo.current_company ? 'Current company not provided' : null,
      yearsExp < 2 ? 'Limited experience for senior roles' : null,
      skillCount < 3 ? 'Skills inventory could be more detailed' : null,
    ].filter(Boolean),
    recommendation,
    experience_match: Math.min(95, Math.round(yearsExp * 12 + 20 + Math.random() * 10)),
    skills_match:     Math.min(95, Math.round(skillCount * 12 + 25 + Math.random() * 10)),
    assessed_at: new Date().toISOString(),
    _note: 'Rule-based assessment. Add DeepSeek credits for AI-powered analysis.',
  }
}