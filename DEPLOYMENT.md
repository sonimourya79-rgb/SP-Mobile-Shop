# Deploying SP Mobile (Free Tier)

```
React (Vercel)  →  Node.js API (Render)  →  MongoDB Atlas
```

All three platforms support "Continue with Google" — sign up on each using
**sonimourya79@gmail.com** and you won't need separate passwords.

Deploy in this order: **Atlas → Render → Vercel → back to Render** (the last step wires
the two deployed URLs together).

---

## 1. MongoDB Atlas (database)

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up with Google
   (sonimourya79@gmail.com).
2. Create a free **M0** cluster (pick any nearby region, e.g. Mumbai).
3. **Database Access** (left sidebar) → **Add New Database User** — create a username/password
   (autogenerate is fine, save it somewhere safe).
4. **Network Access** (left sidebar) → **Add IP Address** → **Allow Access from Anywhere**
   (`0.0.0.0/0`). Render's free tier doesn't have a fixed IP, so this is required.
5. **Database** (left sidebar) → **Connect** on your cluster → **Drivers** → copy the connection
   string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Edit it to include the database name `sp-mobile` before the `?`:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sp-mobile?retryWrites=true&w=majority
   ```
   Save this full string — it's your `MONGO_URI` for the next step.

---

## 2. Render (backend API)

1. Go to https://render.com and sign up with Google (sonimourya79@gmail.com).
2. **New** → **Web Service** → connect your GitHub account → select the `SP-Mobile-Shop` repo.
3. Configure:
   - **Root Directory**: `server`
   - **Name**: `sp-mobile-api` (or anything — you'll get a URL like `https://sp-mobile-api.onrender.com`)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. **Environment Variables** — add each of these (values from `server/.env.example`, using your
   real Atlas connection string):
   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas connection string from step 1 |
   | `JWT_SECRET` | any long random string |
   | `CLIENT_URL` | `http://localhost:5183` for now — you'll update this in step 4 |
   | `ADMIN_NAME` | `SP Mobile Admin` |
   | `ADMIN_EMAIL` | `aa6871678@gmail.com` |
   | `ADMIN_PASSWORD` | a password you choose |
   | `ADMIN_PHONE` | `9653206528` |
   | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | **required** on Render — see [step 6](#6-cloudinary-persistent-image-uploads) below. Without these, uploaded images disappear on every restart/redeploy. |
   | `BREVO_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | optional, see WORKFLOW.md — leave blank to skip email features. See [step 7](#7-brevo-transactional-email) below. |

   Don't set `PORT` — Render sets it automatically and the app already reads `process.env.PORT`.
5. Click **Create Web Service**. Wait for the first deploy to finish, then copy your live URL,
   e.g. `https://sp-mobile-api.onrender.com`. Test it: visit
   `https://sp-mobile-api.onrender.com/api/health` — you should see `{"status":"ok"}`.

   Note: Render's free tier spins the service down after 15 minutes of inactivity — the first
   request after a period of inactivity can take 30-60 seconds to wake back up. This is normal.

---

## 3. Vercel (frontend)

1. Go to https://vercel.com and sign up with Google (sonimourya79@gmail.com).
2. **Add New** → **Project** → import the `SP-Mobile-Shop` repo.
3. Leave the build settings as-is — don't set a Root Directory. The repo has a root-level
   `vercel.json` that tells Vercel to build the `client` folder and serve `client/dist`, so it
   works regardless of what the dashboard UI shows (Vercel's settings page layout has changed
   versions over time, so this avoids relying on finding a specific field).
4. **Environment Variables** — add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://sp-mobile-api.onrender.com/api` (your Render URL from step 2, + `/api`) |
5. Click **Deploy**. When it finishes you'll get a URL like `https://sp-mobile-shop.vercel.app`.

---

## 4. Connect them: update Render's CLIENT_URL

1. Back in Render → your `sp-mobile-api` service → **Environment** → edit `CLIENT_URL` to your
   real Vercel URL from step 3, e.g. `https://sp-mobile-shop.vercel.app`.
2. Save — Render will automatically redeploy with the new value.

Now the frontend and backend can talk to each other with the correct CORS settings.

---

## 5. Seed the live database

Run the seed script from your own machine, pointed at Atlas instead of your local MongoDB:

1. Open `server/.env` locally and temporarily change `MONGO_URI` to your Atlas connection string
   from step 1.
2. Run:
   ```
   cd server
   npm run seed
   ```
   This creates the admin account, demo customer, and all sample accessories/phones directly in
   your live Atlas database.
3. Change `server/.env`'s `MONGO_URI` back to your local MongoDB string afterward, so your local
   dev environment keeps using your local database.

---

## 6. Cloudinary (persistent image uploads)

Render's free web services don't have a persistent disk — without Cloudinary, any image
uploaded through the admin panel (Accessories/Secondhand Phones) or the customer Print Cover
form disappears the next time Render restarts or redeploys. Cloudinary stores the images
externally instead, so they survive restarts.

1. Go to https://cloudinary.com/users/register/free and sign up (Google sign-in with
   sonimourya79@gmail.com works too).
2. Your **Cloud name**, **API Key**, and **API Secret** are shown right on the dashboard home
   page after signup (under "Product Environment Credentials" / "API Keys").
3. In Render → your `sp-mobile-api` service → **Environment**, add:
   | Key | Value |
   |---|---|
   | `CLOUDINARY_CLOUD_NAME` | from the Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | from the Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | from the Cloudinary dashboard |
4. Save — Render redeploys automatically. New uploads now go to Cloudinary and persist
   permanently. (The seed-generated images in `server/uploads/seed-*.png` already work fine
   either way, since they're committed to git and restored on every deploy.)

If these env vars are left blank, the app still works — it just falls back to local disk
storage, which is fine for local development but not for Render.

## 7. Brevo (transactional email)

Render's free tier cannot make outbound SMTP connections (Gmail's SMTP servers are
unreachable from it), so the "Send Offer" broadcast and contact-form notification emails
need an HTTP-based email API instead. Brevo's API works over plain HTTPS.

1. Go to https://onboarding.brevo.com/account/register and sign up for a free account.
2. **Senders & IP** (left sidebar) → **Senders** → add and verify the sending address, e.g.
   `spmobiletechnology@gmail.com` (Brevo emails you a confirmation link — click it).
3. **SMTP & API** (left sidebar) → **API Keys** → **Generate a new API key** → copy it.
4. In Render → your `sp-mobile-api` service → **Environment**, add:
   | Key | Value |
   |---|---|
   | `BREVO_API_KEY` | the API key from step 3 |
   | `EMAIL_FROM_ADDRESS` | the address you verified in step 2, e.g. `spmobiletechnology@gmail.com` |
   | `EMAIL_FROM_NAME` | `SP Mobile` |
5. Save — Render redeploys automatically. Email sending now works. Brevo's free tier includes
   300 emails/day, which is generous for a single shop's contact-form and offer emails.

If `BREVO_API_KEY` is left blank, the app still works — emails are just skipped with a warning
in the server log instead of being sent.

## Visit your live site

Open your Vercel URL (e.g. `https://sp-mobile-shop.vercel.app`) — you should see the full site,
backed by the Render API and Atlas database. Log in with the admin credentials from
[WORKFLOW.md](WORKFLOW.md) (or whatever `ADMIN_PASSWORD` you set in Render).
