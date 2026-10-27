# Invoice Generator

A responsive invoice-generation web application built with **React**, **TypeScript**, and **Vite**, featuring a live invoice preview, automatic calculations, light and dark themes, and print-to-PDF support.

## Features

- Responsive interface for desktop, tablet, and mobile devices
- Live invoice preview while editing
- Customer and billing details
- Invoice number and issue date
- Add and remove invoice item rows
- Automatic subtotal, tax, line-total, and total-due calculations
- Light and dark themes
- Print or save invoices as PDF using the browser's print dialog
- HeavenDent branding

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend and Database
- Node.js
- Express API
- PostgreSQL
- Prisma ORM

> Backend and database features require the API and database to be configured and deployed separately.

## Project Structure

```text
invoice-generator/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   └── src/
│   │       ├── App.tsx
│   │       ├── main.tsx
│   │       ├── styles.css
│   │       ├── types.ts
│   │       └── vite-env.d.ts
│   └── api/
│       ├── prisma/
│       │   └── schema.prisma
│       ├── src/
│       │   └── server.ts
│       ├── .env.example
│       └── package.json
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Requirements

- Node.js (a current LTS release is recommended)
- npm
- PostgreSQL, if using the database-backed API

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/martinmounir/invoice-generator.git
cd invoice-generator
```

### 2. Install dependencies

Run the following command from the project root:

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev:web
```

Vite will display the local development URL in the terminal, usually:

http://localhost:5173

### 4. Configure and start the API

Create a local environment file from the example:

```bash
cp apps/api/.env.example apps/api/.env
```

Update `apps/api/.env` with your local PostgreSQL connection details:

```dotenv
PORT=4000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/heavendent_invoice?schema=public"
WEB_ORIGIN="http://localhost:5173"
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password. Make sure the database exists and the connection details are correct.

Start the API from the project root:

```bash
npm run dev:api
```

### 5. Build the frontend

```bash
npm run build -w apps/web
```

The production build is generated in:

```text
apps/web/dist
```

## Database Setup

The project includes a Prisma schema at:

```text
apps/api/prisma/schema.prisma
```

The root `package.json` provides database-related scripts:

```bash
npm run db:generate
npm run db:migrate
```

Configure the database connection before running these commands. Check `apps/api/package.json` for the exact Prisma commands and migration requirements.

## Environment Variables

### Frontend

The frontend uses `VITE_API_URL` to determine the API base URL. If the variable is not set, the current code falls back to:

```text
http://localhost:4000
```

For production, configure `VITE_API_URL` with the public HTTPS URL of your deployed API:

```dotenv
VITE_API_URL=https://your-api.example.com
```

Replace the example URL with your actual API URL. Rebuild and redeploy the frontend after changing this variable.

**Security note:** Vite environment variables prefixed with `VITE_` are included in the client-side bundle. Never store private credentials or secrets in them.

### Backend

Configure the backend environment variables for your deployment platform, including:

- `PORT`
- `DATABASE_URL`
- `WEB_ORIGIN`

Use the exact variable names expected by the API. Configure `WEB_ORIGIN` with the deployed frontend's origin and ensure the API's CORS policy allows requests from that origin.

Never commit your real `.env` file.

## Deployment

### Frontend Deployment with Vercel

The frontend can be deployed to Vercel.

For this npm-workspaces repository, start with these settings so npm can access the root workspace configuration:

- **Framework Preset:** Vite
- **Root Directory:** Repository root
- **Install Command:** `npm install`
- **Build Command:** `npm run build -w apps/web`
- **Output Directory:** `apps/web/dist`

Verify these settings against the Vercel project configuration before deployment.

Add `VITE_API_URL` to the frontend's deployment environment variables and redeploy after configuring the API.

### Backend and Database Deployment

The backend API and PostgreSQL database must also be deployed for production invoice saving to work.

Before deploying, configure:

- A production PostgreSQL database
- The production `DATABASE_URL`
- Required database migrations
- The API's environment variables
- CORS permissions for the frontend domain
- The frontend's `VITE_API_URL` pointing to the deployed API

**Deploying the frontend alone does not deploy the API or database.** Features that depend on backend persistence will only work when the API and database are deployed and configured correctly.

## Security

- Never commit `.env` files, API keys, database passwords, access tokens, private certificates, or real customer data.
- Keep local environment files excluded using `.gitignore`.
- If a secret is committed accidentally, rotate it. Removing it from the latest commit does not necessarily remove it from Git history.
- This repository is public, so its source code is visible to everyone.
- Do not put private credentials in frontend code or client-side environment variables.

## Current Scope

The project provides an invoice editor and printable invoice preview. Production invoice persistence depends on the backend API and database being deployed and configured correctly.

## License

No license has been specified yet. Unless a license is added to this repository, others do not automatically receive permission to reuse, modify, or distribute this code.
