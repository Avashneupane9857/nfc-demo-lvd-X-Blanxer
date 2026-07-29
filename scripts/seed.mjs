import postgres from "postgres";
import { loadLocalEnv } from "./env.mjs";

loadLocalEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Add it to .env.local or export it before running seed.");
}

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 });

const [aayush] = await sql`
  INSERT INTO customers (full_name, phone, email, demo_pin, member_type, public_title)
  VALUES ('Aayush Shrestha', '9800000001', 'aayush@example.com', '1111', 'Platinum', 'LVD Member')
  ON CONFLICT (phone) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    demo_pin = EXCLUDED.demo_pin,
    member_type = EXCLUDED.member_type,
    public_title = EXCLUDED.public_title
  RETURNING id
`;

const [suman] = await sql`
  INSERT INTO customers (full_name, phone, email, demo_pin, member_type, public_title)
  VALUES ('Suman Lama', '9800000002', 'suman@example.com', '1111', 'Silver', 'LVD Member')
  ON CONFLICT (phone) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    demo_pin = EXCLUDED.demo_pin,
    member_type = EXCLUDED.member_type,
    public_title = EXCLUDED.public_title
  RETURNING id
`;

await sql`
  INSERT INTO nfc_cards (card_uid, customer_id, status)
  VALUES ('lvd-card-001', ${aayush.id}, 'active')
  ON CONFLICT (card_uid) DO UPDATE SET customer_id = EXCLUDED.customer_id, status = EXCLUDED.status
`;

await sql`
  INSERT INTO nfc_cards (card_uid, customer_id, status)
  VALUES ('lvd-card-002', ${suman.id}, 'active')
  ON CONFLICT (card_uid) DO UPDATE SET customer_id = EXCLUDED.customer_id, status = EXCLUDED.status
`;

await sql`
  INSERT INTO staff_users (name, email, demo_pin, role)
  VALUES ('LVD Staff', 'staff@lvd.com', '2222', 'staff')
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    demo_pin = EXCLUDED.demo_pin,
    role = EXCLUDED.role
`;

await sql`DELETE FROM purchases WHERE customer_id IN (${aayush.id}, ${suman.id})`;

await sql`
  INSERT INTO purchases (customer_id, item_name, amount, purchase_date)
  VALUES
    (${aayush.id}, 'Leather Wallet', 4500, '2026-07-05'),
    (${aayush.id}, 'Travel Duffle Bag', 18500, '2026-07-14'),
    (${aayush.id}, 'Premium Belt', 3200, '2026-07-22'),
    (${suman.id}, 'Card Holder', 2200, '2026-07-10'),
    (${suman.id}, 'Leather Cleaner', 950, '2026-07-19')
`;

await sql.end();

console.log("Database seed completed.");
