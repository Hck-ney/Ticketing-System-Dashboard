# IT Support Ticketing System

A full-stack ticketing and support dashboard designed to mirror an internal IT help desk workflow. Users can submit requests, while support staff can review, assign, and update them through a shared system.

## Overview

This project combines a React frontend, an Express backend, and a Supabase-powered database to support a practical support workflow. It covers core full-stack development patterns such as:

- authentication and protected access
- role-based views for users and support staff
- communication between the client and API
- ticket creation, updates, and status tracking
- a clear interface for day-to-day support work

## Project Focus

The app is built around a few everyday support scenarios:

- users can create and track their own requests
- support staff can review incoming tickets and take ownership of them
- ticket status can be updated as work progresses
- the experience is designed to feel clear and usable rather than overly complex

## Key Features

### User Experience
- register and sign in securely
- submit new IT support tickets
- view ticket history and current status
- reopen tickets with additional context
- follow progress over time

### IT Support Experience
- access a dedicated support dashboard
- review active tickets in the system
- assign tickets to themselves
- update status and mark requests as resolved
- review request details and supporting information

### Technical Highlights
- responsive dashboard layout
- feedback notifications for key actions
- JWT-based authentication
- password hashing with bcrypt
- Supabase integration for data persistence
- role-based navigation and interface behavior

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Shadcn UI
- Sonner

### Backend
- Node.js
- Express
- JWT
- bcryptjs
- CORS
- dotenv

### Database & Services
- Supabase
- PostgreSQL

## Live Demo

The frontend and backend are currently live, so the project can be reviewed directly through this URL: https://ticketing-system-dashboard-three.vercel.app/

## Demo Credentials

### User Account
- Email: johndoe@test.com
- Password: password123

### IT Support Account
- Email: john@employee.com
- Password: password123

## How the App Works

1. A user signs in and is directed to the user dashboard.
2. The user creates a support ticket with a title, description, and priority level.
3. The ticket is stored in the database and becomes visible in the user’s ticket history.
4. An employee logs in and can view active tickets.
5. The employee assigns tickets to themselves and updates their status as work progresses.
