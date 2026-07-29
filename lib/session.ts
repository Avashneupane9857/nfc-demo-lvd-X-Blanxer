import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerById, getStaffById } from "@/lib/queries";
import type { Customer, DemoSession, StaffUser } from "@/lib/types";

const SESSION_COOKIE = "lvd_demo_session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};

export async function getCurrentSession(): Promise<DemoSession> {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE)?.value;

  if (!rawSession) {
    return null;
  }

  const [role, userId] = rawSession.split(":");

  if ((role !== "customer" && role !== "staff") || !userId) {
    return null;
  }

  return { role, userId };
}

export async function setCustomerSession(customerId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `customer:${customerId}`, COOKIE_OPTIONS);
}

export async function setStaffSession(staffId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `staff:${staffId}`, COOKIE_OPTIONS);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentCustomer(): Promise<Customer | null> {
  const session = await getCurrentSession();

  if (session?.role !== "customer") {
    return null;
  }

  return getCustomerById(session.userId);
}

export async function getCurrentStaff(): Promise<StaffUser | null> {
  const session = await getCurrentSession();

  if (session?.role !== "staff") {
    return null;
  }

  return getStaffById(session.userId);
}

export async function requireCustomer() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login/customer");
  }

  return customer;
}

export async function requireStaff() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect("/login/staff");
  }

  return staff;
}
