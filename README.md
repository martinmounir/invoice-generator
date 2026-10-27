# Invoice Generator

A responsive invoice-generation web application built with **React**, **TypeScript**, and **Vite**, with a live invoice preview, automatic totals, light/dark mode, and print-to-PDF support.

## Features

- Responsive layout for desktop, tablet, and mobile screens
- Live invoice preview while editing
- Customer and billing details
- Invoice number and issue date
- Add and remove product rows
- Automatic subtotal, tax, line-total, and total-due calculations
- Light and dark themes
- Print or save the invoice as a PDF using the browser's print dialog
- HeavenDent branding

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Node.js workspaces (frontend and API packages)

## Project Structure

```text
invoice-generator/
├── apps/
│   ├── web/       # React + TypeScript + Vite frontend
│   └── api/       # Node.js API
├── package.json   # Workspace scripts
└── README.md
```

## Requirements

- Node.js (use a current LTS release)
- npm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/invoice-generator.git
cd invoice-generator
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install dependencies

Run this from the project root:

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev:web
```

Vite will print a local URL in the terminal, usually `http://localhost:5173`.

### 4. Build the frontend

```bash
npm run build -w apps/web
```

The production build is generated in `apps/web/dist`.

## API Configuration

The frontend uses `VITE_API_URL` to determine the API base URL. If it is not set, the current code falls back to `http://localhost:4000`.

For local development, this default assumes the API is running on port `4000`.

For deployment, configure `VITE_API_URL` in your hosting provider to the public HTTPS URL of your deployed API, for example:

```text
VITE_API_URL=https://your-api.example.com
```

The example URL is a placeholder. Replace it with the actual API URL. Rebuild/redeploy the frontend after changing this Vite environment variable.

> **Note:** Deploying the frontend alone does not deploy the API or database. Invoice saving requires the API and its database to be deployed and configured correctly.

## Deployment

The frontend can be deployed to a static hosting provider such as Vercel.

Typical Vercel settings for this workspace:

- **Root Directory:** `apps/web`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Confirm these settings against the repository and hosting dashboard before deployment. Deploy the API separately if the application needs online invoice saving.

## Security

- Never commit `.env` files, API keys, database credentials, tokens, private certificates, or real customer data.
- Add local environment files to `.gitignore`.
- If a secret was committed, removing it from the latest version is not enough; rotate the secret and clean the repository history as appropriate.
- A public repository makes its source code visible to everyone. Do not put credentials in frontend environment variables; Vite variables prefixed with `VITE_` are included in client-side code.

## Current Scope

This project provides the invoice editor and printable invoice preview. Production persistence depends on a correctly deployed API and database.

## License

No license has been specified yet. Unless you add a license file, others do not automatically receive permission to reuse, modify, or distribute this code.
