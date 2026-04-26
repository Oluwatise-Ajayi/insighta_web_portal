# Insighta Labs+ Web Portal

This repository contains the official frontend web portal for the Insighta Labs+ Profile Intelligence Service. It is built using React, TypeScript, and Vite, and acts as the primary graphical interface for Analysts and Admins to interact with demographic data.

## Features

- **Premium UI/UX**: Features a highly aesthetic, responsive, glassmorphic dark mode design built entirely with Vanilla CSS (no Tailwind).
- **Secure Authentication**: Integrates directly with the backend's GitHub OAuth flow.
- **Robust Session Management**: Uses secure, `HttpOnly` cookies to manage sessions, entirely protecting against XSS attacks.
- **Automatic Token Rotation**: An intelligent Axios interceptor automatically catches `401 Unauthorized` responses and exchanges the HTTP-only refresh cookie for a new session seamlessly.
- **Natural Language Parsing**: Includes a search interface allowing users to query the database using plain English (e.g., "young females from nigeria").
- **CSV Export**: Direct one-click integration with the backend's CSV export endpoint to download filtered demographic data.

## Local Development

### Prerequisites
Make sure the Insighta Labs+ backend is running on `http://localhost:3000` before starting the web portal.

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3001`. 
*(Note: The server is strictly bound to port 3001 to ensure compatibility with the backend's CORS configuration).*

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (configured with `withCredentials: true`)
- **Styling**: Vanilla CSS (`src/index.css`)
- **Icons**: Lucide React
