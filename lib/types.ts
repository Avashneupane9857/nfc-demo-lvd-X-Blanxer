export type MemberType = "Silver" | "Gold" | "Platinum";

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  demoPin: string;
  memberType: MemberType;
  publicTitle: string;
  createdAt: Date;
};

export type NfcCard = {
  id: string;
  cardUid: string;
  customerId: string;
  status: "active" | "inactive";
  createdAt: Date;
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  demoPin: string;
  role: string;
  createdAt: Date;
};

export type Purchase = {
  id: string;
  customerId: string;
  itemName: string;
  amount: number;
  purchaseDate: string;
};

export type CardProfile = {
  card: NfcCard;
  customer: Customer;
  purchases: Purchase[];
};

export type DemoSession =
  | { role: "customer"; userId: string }
  | { role: "staff"; userId: string }
  | null;
