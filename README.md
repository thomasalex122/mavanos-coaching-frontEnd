# Mavano Sports — Frontend

A modern, responsive coaching platform that connects sports coaches with students. Built with Next.js and TypeScript, featuring role-based dashboards for coaches and students.

---

Link = https://mavanos-coaching-front-17rctr9xj-thomasjoshua466-6743s-projects.vercel.app/ 

## Features

**For Coaches**
- Create and manage coaching sessions with custom slots and venues
- View session analytics — top performing sessions and revenue tracking
- Monitor total bookings across all sessions

**For Students**
- Browse and filter available sessions by sport or location
- Book sessions instantly with real-time slot availability
- Track current and past bookings from a personal dashboard

**General**
- Role-based routing — coaches and students see different dashboards after login
- JWT token-based authentication with persistent session management
- Clean dark-mode UI with smooth transitions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites
- Node.js v18 or later
- Mavano Sports API (backend) running locally or deployed

### Installation

```bash
git clone https://github.com/thomasalex122/mavanos-coaching-frontEnd.git
cd mavanos-coaching-frontEnd/frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── login/              # Authentication page with password toggle
│   ├── coach-dashboard/    # Session management and creation modal
│   ├── coach-analytics/    # Metrics, revenue tracking, session performance
│   └── student-dashboard/  # Session browsing, filtering, and booking
└── lib/
    └── api.ts              # Centralized Axios instance with JWT interceptor
```

---

## Related

[Mavano Sports API — Backend Repository](https://github.com/thomasalex122/Mavanos-coaching-api)
