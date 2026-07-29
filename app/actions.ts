"use server";

import { redirect } from "next/navigation";
import { clearSession, setCustomerSession, setStaffSession } from "@/lib/session";
import { getCustomerByPhone, getStaffByEmail } from "@/lib/queries";

function normalize(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

export async function customerLoginAction(formData: FormData) {
  const phone = normalize(formData.get("phone"));
  const pin = normalize(formData.get("pin"));
  const customer = await getCustomerByPhone(phone);

  if (!customer || customer.demoPin !== pin) {
    redirect("/login/customer?error=invalid");
  }

  await setCustomerSession(customer.id);
  redirect("/account");
}

export async function staffLoginAction(formData: FormData) {
  const email = normalize(formData.get("email")).toLowerCase();
  const pin = normalize(formData.get("pin"));
  const staff = await getStaffByEmail(email);

  if (!staff || staff.demoPin !== pin) {
    redirect("/login/staff?error=invalid");
  }

  await setStaffSession(staff.id);
  redirect("/");
}

export async function logoutAction(formData: FormData) {
  const next = normalize(formData.get("next")) || "/";

  await clearSession();
  redirect(next.startsWith("/") ? next : "/");
}
