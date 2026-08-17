# Contact Form

Responsive React contact page based on the supplied Figma layout. Messages are sent from the backend through SMTP with Nodemailer. A single optional attachment up to 10 MB is supported.

## Requirements

- Node.js 20.19+ or 22.12+ (current LTS recommended)
- An SMTP account

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create the environment file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

3. Fill in `.env` with your SMTP settings:

```env
PORT=3001
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=your_password
MAIL_FROM=user@example.com
MAIL_TO=recipient@example.com
VITE_CONTACT_EMAIL=infoname@mail.com
```

`MAIL_TO` is the address that receives contact-form notifications. `VITE_CONTACT_EMAIL` controls the email displayed on the page.

For port 465 set `SMTP_SECURE=true`. For port 587 normally keep it `false` so the SMTP connection can upgrade with STARTTLS.

## Development

```bash
npm run dev
```

Open `http://localhost:5173`.

The Vite development server proxies `/api` requests to the backend on port 3001.

## Production

Build the frontend:

```bash
npm run build
```

Start the server:

```bash
npm start
```

Open `http://localhost:3001`.

The production server serves the React build and the contact API from the same process.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend port |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_SECURE` | `true` for implicit TLS, normally port 465 |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password or provider-specific app password |
| `MAIL_FROM` | Sender address accepted by the SMTP provider |
| `MAIL_TO` | Address that receives form messages |
| `VITE_CONTACT_EMAIL` | Email displayed in the page header |
