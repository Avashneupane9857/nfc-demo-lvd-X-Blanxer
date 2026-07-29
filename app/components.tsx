import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { getCurrentCustomer, getCurrentStaff } from "@/lib/session";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [customer, staff] = await Promise.all([getCurrentCustomer(), getCurrentStaff()]);
  const mode = staff ? "Staff mode" : customer ? "Customer mode" : "Public mode";
  const identity = staff?.name || customer?.fullName || "Visitor";

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              LVD
            </span>
            <span className="text-xl font-black tracking-normal">NFC Membership Demo</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 font-semibold">
              {mode}: {identity}
            </span>
            {(customer || staff) && (
              <form action={logoutAction}>
                <input type="hidden" name="next" value="/" />
                <button className="rounded-full bg-neutral-950 px-4 py-2 font-semibold text-white">
                  Logout
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:py-12">{children}</main>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="mb-8">
      {eyebrow && (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-5xl">{title}</h1>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">{description}</p>
      )}
    </section>
  );
}

export function ActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "bg-neutral-950 text-white hover:bg-neutral-800"
      : "border border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-bold transition ${className}`}
    >
      {children}
    </Link>
  );
}

export function InfoPanel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">{children}</section>
  );
}

export function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
