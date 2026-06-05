# Devotion Applicant Tracking System (DATS)

![License](https://img.shields.io/badge/license-MIT-blue.svg)

A mini **Applicant Tracking System** to streamline hiring workflows, manage candidates, and centralize job applications - built for recruiters, hiring teams, and developers who want a self-hosted recruitment platform.

## Features

- **Job Posting Management** – Create, edit, and publish job openings
- **Applicant Tracking** – Collect, store, and manage candidate applications
- **Custom Pipelines** – Drag-and-drop Kanban board for hiring stages (Screening → Interview → Offer → Hired)
- **Search & Filter** – Find candidates by skills, status, stage, or date
- **Role-Based Access** – Admin, Hiring Manager, and Interviewer roles
- **Email Notifications** – Automatic updates to candidates and team members
- **Resume Storage** – Upload and organize CVs and documents
- **Internal Notes & Feedback** – Collaborate on candidate evaluations
- (pending) **API-First Design** – Easy integration with existing HR tools

## Tech Stack

- **Frontend:** Next.js
- **Backend:** Node.js
- **Database:** Supabase
- **Authentication:** Supabase
- **Deployment:** Vercel

## Quick Start

### Prerequisites

- Node.js (v18+)
- Supabase account
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/favouralgo/devotion-ats.git

# Navigate to project
cd devotion-ats

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev