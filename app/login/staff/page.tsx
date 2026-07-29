import { staffLoginAction } from "@/app/actions";
import { AppShell, ActionLink, InfoPanel, PageTitle } from "@/app/components";

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AppShell>
      <PageTitle
        eyebrow="Staff"
        title="Staff login"
        description="Use this before scanning the card in store to prove the staff lookup flow."
      />

      <div className="grid gap-5 lg:grid-cols-[0.7fr_0.3fr]">
        <InfoPanel>
          {error === "invalid" && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              Invalid staff email or PIN.
            </p>
          )}
          <form action={staffLoginAction} className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold">Email</span>
              <input
                name="email"
                defaultValue="staff@lvd.com"
                required
                type="email"
                className="mt-2 w-full rounded-md border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-950"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Demo PIN</span>
              <input
                name="pin"
                defaultValue="2222"
                required
                type="password"
                className="mt-2 w-full rounded-md border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-950"
              />
            </label>
            <button className="min-h-11 rounded-md bg-neutral-950 px-5 py-2 text-sm font-bold text-white">
              Login as staff
            </button>
          </form>
        </InfoPanel>

        <InfoPanel>
          <h2 className="text-lg font-black">After login</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Tap or open the NFC card URL and staff will see private customer lookup details.
          </p>
          <div className="mt-4">
            <ActionLink href="/nfc/lvd-card-001" variant="secondary">
              Open card
            </ActionLink>
          </div>
        </InfoPanel>
      </div>
    </AppShell>
  );
}
