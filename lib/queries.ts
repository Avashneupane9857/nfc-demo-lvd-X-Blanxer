import { db } from "@/lib/db";
import type { CardProfile, Customer, NfcCard, Purchase, StaffUser } from "@/lib/types";

type CustomerRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  demo_pin: string;
  member_type: Customer["memberType"];
  public_title: string;
  created_at: Date;
};

type NfcCardRow = {
  id: string;
  card_uid: string;
  customer_id: string;
  status: NfcCard["status"];
  created_at: Date;
};

type StaffRow = {
  id: string;
  name: string;
  email: string;
  demo_pin: string;
  role: string;
  created_at: Date;
};

type PurchaseRow = {
  id: string;
  customer_id: string;
  item_name: string;
  amount: string;
  purchase_date: string;
};

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    demoPin: row.demo_pin,
    memberType: row.member_type,
    publicTitle: row.public_title,
    createdAt: row.created_at,
  };
}

function mapNfcCard(row: NfcCardRow): NfcCard {
  return {
    id: row.id,
    cardUid: row.card_uid,
    customerId: row.customer_id,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapStaff(row: StaffRow): StaffUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    demoPin: row.demo_pin,
    role: row.role,
    createdAt: row.created_at,
  };
}

function mapPurchase(row: PurchaseRow): Purchase {
  return {
    id: row.id,
    customerId: row.customer_id,
    itemName: row.item_name,
    amount: Number(row.amount),
    purchaseDate: row.purchase_date,
  };
}

export async function getCustomerByPhone(phone: string) {
  const sql = db();
  const [customer] = await sql<CustomerRow[]>`
    SELECT * FROM customers WHERE phone = ${phone} LIMIT 1
  `;

  return customer ? mapCustomer(customer) : null;
}

export async function getCustomerById(id: string) {
  const sql = db();
  const [customer] = await sql<CustomerRow[]>`
    SELECT * FROM customers WHERE id = ${id} LIMIT 1
  `;

  return customer ? mapCustomer(customer) : null;
}

export async function getStaffByEmail(email: string) {
  const sql = db();
  const [staff] = await sql<StaffRow[]>`
    SELECT * FROM staff_users WHERE email = ${email} LIMIT 1
  `;

  return staff ? mapStaff(staff) : null;
}

export async function getStaffById(id: string) {
  const sql = db();
  const [staff] = await sql<StaffRow[]>`
    SELECT * FROM staff_users WHERE id = ${id} LIMIT 1
  `;

  return staff ? mapStaff(staff) : null;
}

export async function getPurchasesByCustomerId(customerId: string) {
  const sql = db();
  const purchases = await sql<PurchaseRow[]>`
    SELECT *
    FROM purchases
    WHERE customer_id = ${customerId}
    ORDER BY purchase_date DESC
  `;

  return purchases.map(mapPurchase);
}

export async function getCardByCustomerId(customerId: string) {
  const sql = db();
  const [card] = await sql<NfcCardRow[]>`
    SELECT *
    FROM nfc_cards
    WHERE customer_id = ${customerId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return card ? mapNfcCard(card) : null;
}

export async function getCardProfileByCardId(cardId: string): Promise<CardProfile | null> {
  const sql = db();
  const [row] = await sql<(NfcCardRow & CustomerRow)[]>`
    SELECT
      nfc_cards.id,
      nfc_cards.card_uid,
      nfc_cards.customer_id,
      nfc_cards.status,
      nfc_cards.created_at,
      customers.id AS id,
      customers.full_name,
      customers.phone,
      customers.email,
      customers.demo_pin,
      customers.member_type,
      customers.public_title,
      customers.created_at AS created_at
    FROM nfc_cards
    INNER JOIN customers ON customers.id = nfc_cards.customer_id
    WHERE nfc_cards.card_uid = ${cardId}
    LIMIT 1
  `;

  if (!row) {
    return null;
  }

  const [cardRow] = await sql<NfcCardRow[]>`
    SELECT * FROM nfc_cards WHERE card_uid = ${cardId} LIMIT 1
  `;
  const [customerRow] = await sql<CustomerRow[]>`
    SELECT customers.*
    FROM customers
    INNER JOIN nfc_cards ON nfc_cards.customer_id = customers.id
    WHERE nfc_cards.card_uid = ${cardId}
    LIMIT 1
  `;

  if (!cardRow || !customerRow) {
    return null;
  }

  const customer = mapCustomer(customerRow);

  return {
    card: mapNfcCard(cardRow),
    customer,
    purchases: await getPurchasesByCustomerId(customer.id),
  };
}
