# SP Mobile — Shop Website

Full-stack website for **SP Mobile** (Appapada, Malad East) — mobile accessories, all types of
repairing, and secondhand phone buy & sell. Built with the MERN stack (MongoDB, Express, React,
Node.js) with a customer-facing site and an admin panel for day-to-day shop operations.

For login credentials and a walkthrough of what each role can do, see **[WORKFLOW.md](WORKFLOW.md)**.

## Tech Stack

- **Client**: React (Vite) + React Router + Tailwind CSS + Axios
- **Server**: Node.js + Express + Mongoose (MongoDB) + JWT auth + Multer (image uploads, stored on
  Cloudinary in production) + Brevo (transactional email via HTTP API)

## Project Structure

```
Shop/
  client/    React frontend (customer site + admin panel)
  server/    Express API + MongoDB models
  database_dump/   MongoDB dump with ready-made demo data (see below)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or an Atlas connection string)

## Setup

1. Install dependencies (installs root, server and client packages):
   ```
   npm run install:all
   ```

2. Configure the server environment. Copy `server/.env.example` to `server/.env` and fill in values:
   ```
   cp server/.env.example server/.env
   ```
   Key variables:
   - `MONGO_URI` — MongoDB connection string
   - `JWT_SECRET` — any long random string
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin account created by the seed script
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — optional for local
     dev (uploads just save to `server/uploads/` on disk if left blank), but **required** in
     production on hosts with an ephemeral filesystem (e.g. Render's free tier), otherwise uploaded
     images vanish on every restart. See the comments in `.env.example` for how to get these from a
     free Cloudinary account.
   - `BREVO_API_KEY` — optional, needed for the contact form email notification and the admin
     "Send Offer" bulk email feature. See the comments in `.env.example` for how to get a free Brevo
     API key. The site works fine without it — emails are just skipped.

3. Load demo data. Either:
   - **Run the seed script** (creates the admin account + realistic sample accessories, secondhand
     phones, repair/sell requests, an order, and contact messages):
     ```
     npm run seed
     ```
   - **Or restore the included database dump** directly (same data, pre-generated):
     ```
     mongorestore --uri="mongodb://127.0.0.1:27017/sp-mobile" --drop database_dump/sp-mobile
     ```

4. Start both client and server together:
   ```
   npm run dev
   ```
   - Backend: http://localhost:5050
   - Frontend: http://localhost:5183

## Login Credentials (from the seed data)

| Role     | Email                     | Password        |
|----------|---------------------------|-----------------|
| Admin    | aa6871678@gmail.com       | SPMobile@123    |
| Customer | customer@spmobile.test    | Customer@123    |

See [WORKFLOW.md](WORKFLOW.md) for what each role can do.

## Notes

- Uploaded product/phone images are stored on disk under `server/uploads/` and served at `/uploads/*`.
- The seeded accessories/secondhand phones ship with generated placeholder photos (branded gradient +
  icon graphics, `server/uploads/seed-*.png`) — these are committed to git unlike real uploads, so
  they show up correctly whether you populate the DB via `npm run seed` or by restoring `database_dump/`.
- Order flow is inquiry-based — no payment gateway. Customers submit an order/repair/sell request and
  the shop follows up by phone/WhatsApp.
- Ports are pinned (server `5050`, client `5183`) via `server/.env` (`PORT`) and `client/vite.config.js`
  (`server.port`) to avoid clashing with other projects on the same machine — change them if needed.
