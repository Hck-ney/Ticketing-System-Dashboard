# IT Support Ticketing System

A full-stack ticketing and support dashboard built to showcase real-world web development skills in a portfolio-friendly project. The app simulates an internal IT help desk where users can submit tickets and employees can review, assign, and resolve them.

## Overview

This project brings together a modern React frontend, an Express backend, and a Supabase-powered database to create a practical support workflow experience. It was designed to highlight core full-stack development concepts such as:

- Authentication and protected access
- Role-based dashboards for users and employees
- REST API communication between frontend and backend
- Database-driven ticket creation and updates
- Clean UI design and interactive workflows

## Why This Project Matters

This is a strong portfolio project because it demonstrates:

- End-to-end application development
- Realistic business logic for support operations
- Secure authentication and data handling practices
- Responsive UI design with polished user experience
- API integration and state management in a production-style app

## Key Features

### User Experience
- Register and sign in securely
- Submit new IT support tickets
- View personal ticket history and status updates
- Reopen tickets with additional context
- Track ticket progress over time

### Employee Experience
- Access a dedicated employee dashboard
- View active tickets from the system
- Assign tickets to themselves
- Update ticket status and mark tickets as resolved
- Review ticket details and request information

### Technical Highlights
- Responsive dashboard layout
- Toast notifications for user feedback
- JWT-based authentication
- Password hashing with bcrypt
- Supabase integration for persistent data storage
- Role-based navigation and UI behavior

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Shadcn UI
- Zustand
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
```

## Local Development

### Prerequisites
- Node.js
- npm
- A Supabase project

### Install dependencies

From the frontend folder:

```bash
cd frontend
npm install
```

From the server folder:

```bash
cd ../server
npm install
```

### Environment Variables

Create a .env file in the server folder:

```env
PORT=5000
JWT_SECRET=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_service_role_key
CORS_ORIGIN=http://localhost:5173
```

Create a .env file in the frontend folder if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Then open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Deployment to Vercel

This project is ready to be deployed with Vercel for both the frontend and backend.

### Frontend Vercel settings
Set this environment variable in Vercel for the frontend project:

```env
VITE_API_URL=https://your-backend-url/api
```

### Backend Vercel settings
Set these environment variables in Vercel for the backend project:

```env
PORT=5000
JWT_SECRET=your_production_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_service_role_key
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

> If you deploy the frontend and backend as separate Vercel projects, make sure the backend CORS origin includes your frontend domain.

## Demo Credentials

> These are placeholder credentials for local testing or demo purposes. Replace them with your own seeded accounts when needed.

### User Account
- Email: user@example.com
- Password: password123

### Employee Account
- Email: employee@example.com
- Password: password123

## How the App Works

1. A user signs in and is directed to the user dashboard.
2. The user creates a support ticket with a title, description, and priority level.
3. The ticket is stored in the database and becomes visible in the user’s ticket history.
4. An employee logs in and can view active tickets.
5. The employee assigns tickets to themselves and updates their status as work progresses.
