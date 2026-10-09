# File Uploader

A stripped-down personal cloud drive, inspired by Google Drive. Users can sign up, organise their files into folders, upload and download files stored in the cloud, and share a folder with anyone through a link that expires.

Built as part of the [File Uploader project](https://www.theodinproject.com/lessons/nodejs-file-uploader) from **The Odin Project** Full Stack JavaScript curriculum.

**Live demo:** [your-app.onrender.com](https://project-file-uploader-top.onrender.com/)

> Hosted on Render's free tier: the server sleeps when idle, so the first visit may take a few seconds to wake it up.

---

## Features

- **Authentication**: sign up, log in and log out with Passport.js (local strategy). Passwords are hashed with bcrypt, and sessions are persisted in PostgreSQL.
- **Folders**: create, rename and delete folders. Deleting a folder also deletes its files, both from the database and from cloud storage.
- **Files**: upload files to the root of your drive or into a folder, view their details (name, size, type, upload date), download them under their original name, and delete them.
- **Cloud storage**: files are stored in a private Supabase Storage bucket. Downloads go through short-lived signed URLs, so files are never publicly accessible.
- **File validation**: uploads are limited to 5 MB and to an allow-list of file types (images and PDF).
- **Folder sharing** (extra credit): generate a public link to a folder, valid for 1, 7 or 30 days. Anyone with the link can browse the folder and download its files without an account. Links can be copied in one click and revoked at any time.
- **Ownership checks**: every folder, file and share route checks that the resource belongs to the logged-in user, and answers with a 404 otherwise.

## Tech stack

| Layer | Tools |
| --- | --- |
| Server | Node.js, Express 5 |
| Views | EJS, vanilla CSS (light and dark mode), Lucide icons |
| Database | PostgreSQL, Prisma ORM 7 (with `@prisma/adapter-pg`) |
| Auth | Passport.js, `passport-local`, `express-session`, `@quixo3/prisma-session-store`, bcryptjs |
| Uploads | Multer (memory storage), Supabase Storage |
| Validation | express-validator |
| Hosting | Render (app), Supabase (database and storage) |

## Getting started

### Prerequisites

- Node.js 20 or later
- A local PostgreSQL database
- A [Supabase](https://supabase.com) project with a **private** storage bucket

### Installation

```bash
git clone https://github.com/Aurel-Charles/Project-File-Uploader-TOP.git
cd Project-File-Uploader-TOP
npm install
```

`npm install` also runs `prisma generate` (through the `postinstall` script) to create the Prisma client in `generated/prisma`.

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/file_uploader"
SESSION_SECRET="a-long-random-string"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SECRET_KEY="your-supabase-secret-key"
SUPABASE_BUCKET="user-files"
```

The Supabase **secret** key is only used on the server. Never expose it in the browser.

### Database

```bash
npx prisma migrate dev
```

### Run the app

```bash
npm run dev   # development, with nodemon
npm start     # production
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
├── app.js              # Express app setup and error handler
├── config/             # Passport strategy, session store, Multer config
├── controllers/        # Route handlers (auth, folders, files, shares)
├── lib/                # Prisma and Supabase clients
├── middleware/         # Auth and ownership checks, HTTP errors, logger
├── prisma/             # Schema and migrations
├── public/             # CSS and client-side JS
├── routes/             # Express routers
├── utils/              # Helpers (password hashing, size formatting)
└── views/              # EJS templates
```

## Routes

| Method | Path | Description |
| --- | --- | --- |
| GET / POST | `/sign-up` | Sign-up form and account creation |
| GET / POST | `/log-in` | Log-in form and authentication |
| POST | `/log-out` | Log out and destroy the session |
| GET | `/folders` | Root of the drive: folders and loose files |
| GET / POST | `/folders/new`, `/folders` | Create a folder |
| GET | `/folders/:id` | Folder content and its share links |
| GET / POST | `/folders/:id/edit`, `/folders/:id/update` | Rename a folder |
| POST | `/folders/:id/delete` | Delete a folder and its files |
| POST | `/folders/:id/files` | Upload a file into a folder |
| POST | `/folders/:id/share` | Create a share link |
| POST | `/folders/:id/shares/:shareId/delete` | Revoke a share link |
| POST | `/files` | Upload a file to the root |
| GET | `/files/:id` | File details |
| GET | `/files/:id/download` | Download a file (signed URL) |
| POST | `/files/:id/delete` | Delete a file |
| GET | `/share/:id` | Public view of a shared folder |
| GET | `/share/:id/files/:fileId/download` | Public download of a shared file |

## Deployment

The app is deployed on **Render** as a Node web service, with the **Supabase** PostgreSQL database (through the IPv4 session pooler) and Supabase Storage.

- **Build command:** `npm install --include=dev && npx prisma migrate deploy`
- **Start command:** `npm start`
- **Environment variables:** the ones listed above, plus `NODE_ENV=production` and `NODE_VERSION`.

In production, Express trusts Render's proxy (`trust proxy`) so that the session cookie can be sent with the `secure` flag over HTTPS.

## What I learned

- Modelling one-to-many relations with Prisma, cascading deletes and querying related data with `include`
- Session-based authentication with Passport, and storing sessions in the database
- Protecting resources with ownership middleware (`router.param`) and answering 404 instead of 403 to avoid leaking information
- Handling file uploads with Multer and moving storage to the cloud with private buckets and signed URLs
- Centralised error handling with a custom `HttpError` class and Express 5's async error support
- Deploying a full-stack app with environment-specific configuration

## Author

**Aurel Charles**, [GitHub](https://github.com/Aurel-Charles)
