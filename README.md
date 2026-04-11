# Student Health & Wellness Platform - Frontend

A modern React-based frontend application for managing student health and wellness resources.

## Features

### Admin Features
- Manage health resources (add, edit, delete, activate/deactivate)
- Manage wellness programs
- Track usage metrics and analytics
- View user activity

### Student Features
- Access health resources (Mental Health, Fitness, Nutrition, General Wellness)
- Participate in wellness programs
- Request support services
- Filter resources by category

## Tech Stack

- **React 18** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ResourceManagement.jsx
│   │   ├── WellnessPrograms.jsx
│   │   └── UsageMetrics.jsx
│   ├── Student/
│   │   ├── StudentDashboard.jsx
│   │   ├── Resources.jsx
│   │   ├── WellnessPrograms.jsx
│   │   └── SupportServices.jsx
│   ├── Auth/
│   │   └── Login.jsx
│   └── Shared/
│       └── Navbar.jsx
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Connected Backend

The frontend is now connected to Spring Boot APIs via Vite proxy (`/api` -> `http://localhost:8080`).

## Demo Login

- `admin@wellness.edu` / `password`
- `student@wellness.edu` / `password`
- Or create a new student account from Sign Up

## Dev Flow

- Frontend auto-refresh is enabled by Vite HMR when running `npm run dev`
- CRUD actions in Admin and Student dashboards write to local MySQL through backend APIs

