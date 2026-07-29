# LVD NFC Membership Demo

Next.js demo for the LVD NFC membership card flow.

The physical NFC card stores only one URL:

```text
https://your-vercel-domain.vercel.app/nfc/lvd-card-001
```

The app decides what to show based on login state:

- Public visitor: name and LVD member label only
- Customer: own account information
- Staff: customer name, phone, member type, card status, and purchase history

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local` from `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
NEXT_PUBLIC_APP_URL="https://nfc-demo-lvd-x-blanxer.vercel.app"
```

3. Run database migration and seed:

```bash
pnpm db:migrate
pnpm db:seed
```

4. Start local dev server:

```bash
pnpm dev
```

## Demo Credentials

Customer:

```text
Phone: 9800000001
PIN: 1111
```

Staff:

```text
Email: staff@lvd.com
PIN: 2222
```

## Test Flow

1. Open `/nfc/lvd-card-001` without login.
   Public profile appears.

2. Login at `/login/customer`.
   Open `/nfc/lvd-card-001`.
   Customer account appears.

3. Logout, then login at `/login/staff`.
   Open `/nfc/lvd-card-001`.
   Staff customer lookup appears.

4. Open `/nfc/wrong-card`.
   Card not found appears.

## Vercel Deployment

1. Import the repo in Vercel.
2. Set project root directory to `nfc-demo`.
3. Add environment variables:

```env
DATABASE_URL="NEON_POSTGRES_CONNECTION_STRING"
NEXT_PUBLIC_APP_URL="https://nfc-demo-lvd-x-blanxer.vercel.app"
```

4. Deploy.
5. Run migration and seed against the Neon database.
6. Use NFC Tools app to write:

```text
https://nfc-demo-lvd-x-blanxer.vercel.app/nfc/lvd-card-001
```

## Scripts

```bash
pnpm lint
pnpm build
pnpm db:migrate
pnpm db:seed
```
