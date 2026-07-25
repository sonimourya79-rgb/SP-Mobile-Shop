# SP Mobile — Workflow Guide (Admin & Customer)

This guide explains how each role uses the site day to day. For install/run instructions, see
[README.md](README.md).

## Login Credentials

| Role     | Email                     | Password        | Where to log in            |
|----------|---------------------------|-----------------|-----------------------------|
| Admin    | aa6871678@gmail.com       | SPMobile@123    | /login → auto-redirects to /admin |
| Customer | customer@spmobile.test    | Customer@123    | /login → redirects to home  |

These accounts are created automatically by the seed script (`npm run seed`) or by restoring
`database_dump/`. Change the admin password in production by editing it directly in the admin's
Profile flow, or re-seeding with a different `ADMIN_PASSWORD` in `server/.env`.

---

## Customer Workflow

1. **Browse without an account** — Accessories (`/products`), Secondhand Phones (`/secondhand`),
   and their detail pages are all public. So are the Repair booking form, Sell Your Phone form,
   and Contact form — a guest can submit any of these with just name/phone/email.
2. **Register / Login** (`/register`, `/login`) — required only to place an order, and to see your
   own history (My Orders / My Repairs / My Sell Requests) under "My Account".
3. **Shop accessories or secondhand phones** — "Add to Cart" works without login; the cart is saved
   in the browser. Logging in is only required at checkout.
4. **Checkout** (`/checkout`) — no online payment. You submit your name/phone/address and the order
   is created with status `pending`; the shop calls to confirm and arrange payment/delivery.
5. **Book a repair** (`/repair`) — submit device brand/model, issue type, and description. Track its
   status (received → diagnosing → in-progress → completed → delivered) under My Repairs.
6. **Sell your phone** (`/sell-phone`) — submit device details and an expected price. Track status
   (pending → contacted → offer-made → purchased/rejected) under My Sell Requests.
7. **Contact the shop** (`/contact`) — a general inquiry form; also emails the shop directly if email
   is configured on the server.

## Admin Workflow

Log in with the admin account — you're redirected straight to `/admin`.

1. **Dashboard** (`/admin`) — at-a-glance counts: new repair requests, repairs in progress, pending
   sell requests, pending orders, low-stock accessories, total accessories, available secondhand
   phones, total orders. Each card links to the relevant screen.
2. **Customers** (`/admin/customers`) — see every registered customer (name, email, phone, join
   date). Add a customer account manually, edit their details, reset their password, or delete an
   account.
3. **Accessories** (`/admin/products`) — three tabs:
   - **Catalog** — grouped by category into collapsible sections (click a section header to
     collapse/expand) so a large catalog stays easy to scan. Add/edit/delete accessories: name,
     description, category, price, stock, active toggle, and up to 6 images per item (drag in
     files, remove individual images with the × on the thumbnail). Categories cover every
     accessory type: Tempered Glass, Back Cover, Charger, Charging Cable, Power Bank, Battery,
     Wired Earphones, Neckband Bluetooth, Bluetooth Earbuds, Bluetooth Speaker, Mobile Holder,
     OTG & Adapters, Other.
   - **Import from Excel/CSV** button (top of Catalog) — bulk-add accessories from a spreadsheet.
     Upload a CSV with columns Name/Category/Price/Stock/Description (an Excel file must be saved
     as CSV first — File → Save As → CSV), review/edit every parsed row and attach images per row
     in the preview table, then import them all at once. Unrecognized categories default to
     "Other" so nothing gets lost.
   - **Purchase Entry** — record stock coming in from a supplier: pick the accessory, quantity, cost
     price, supplier (optional), notes — stock increases immediately and the entry is logged for
     record-keeping.
   - **Sale Entry** — record an in-store walk-in sale one at a time: pick the accessory, quantity,
     selling price (prefilled from the listing, editable), optional customer name — stock decreases
     immediately. This is separate from the website's online Orders (which customers place themselves
     through checkout); use Sale Entry for counter sales that never touch the cart.
   Stock also auto-decrements when an online order containing that item is marked `confirmed`.
3. **Secondhand Phones** (`/admin/secondhand`) — add/edit/delete listings: brand, model, condition,
   storage, color, price, description, images, and status (`available`/`sold`). A phone is
   auto-marked `sold` when its order is confirmed.
4. **Repair Requests** (`/admin/repairs`) — filter by status, update status, set an estimated cost,
   and leave admin notes visible to the customer on their My Repairs page.
5. **Sell Requests** (`/admin/sell-requests`) — filter by status, update status, set an offered
   price, and leave admin notes.
6. **Orders** (`/admin/orders`) — filter by status, update status, add notes. Marking an order
   `confirmed` deducts accessory stock and marks any secondhand phones in it as sold — do this once
   you've actually confirmed the sale with the customer.
7. **Contact Messages** (`/admin/messages`) — inbox of everything submitted via the Contact Us form;
   mark as `new` / `read` / `replied`.
8. **Send Offer** (`/admin/send-offer`) — compose a subject + message and email it to every
   registered customer in one go (e.g. a festival discount). Requires `EMAIL_USER`/`EMAIL_PASS` to be
   configured in `server/.env` — otherwise it will tell you nothing was sent.

## Email Setup (optional but recommended)

Both the Contact form notification and the "Send Offer" broadcast rely on the email settings in
`server/.env`:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=aa6871678@gmail.com
EMAIL_PASS=<Gmail App Password, not the normal password>
EMAIL_FROM=SP Mobile <aa6871678@gmail.com>
```

To get a Gmail App Password: enable 2-Step Verification on the Gmail account, then create one at
https://myaccount.google.com/apppasswords. Paste it into `EMAIL_PASS` and restart the server.
