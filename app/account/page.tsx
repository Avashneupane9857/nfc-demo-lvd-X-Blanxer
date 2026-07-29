import { AppShell, InfoPanel, PageTitle, Stat } from "@/app/components";
import { getCardByCustomerId, getPurchasesByCustomerId } from "@/lib/queries";
import { requireCustomer } from "@/lib/session";
import { formatNpr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await requireCustomer();
  const [card, purchases] = await Promise.all([
    getCardByCustomerId(customer.id),
    getPurchasesByCustomerId(customer.id),
  ]);
  const totalSpend = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <AppShell>
      <PageTitle
        eyebrow="Customer account"
        title={customer.fullName}
        description="This is the private customer account view shown when the card owner is logged in."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="Member type" value={customer.memberType} />
        <Stat label="NFC card" value={card?.cardUid || "No card"} />
        <Stat label="Total spend" value={formatNpr(totalSpend)} />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.4fr_0.6fr]">
        <InfoPanel>
          <h2 className="text-xl font-black">Account details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-bold">Phone</dt>
              <dd className="text-neutral-600">{customer.phone}</dd>
            </div>
            <div>
              <dt className="font-bold">Email</dt>
              <dd className="text-neutral-600">{customer.email}</dd>
            </div>
            <div>
              <dt className="font-bold">Status</dt>
              <dd className="text-neutral-600">Active LVD member</dd>
            </div>
          </dl>
        </InfoPanel>

        <InfoPanel>
          <h2 className="text-xl font-black">Recent purchases</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-neutral-200">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="grid gap-2 border-b border-neutral-200 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_auto_auto]"
              >
                <span className="font-semibold">{purchase.itemName}</span>
                <span className="text-neutral-600">{purchase.purchaseDate}</span>
                <span className="font-bold">{formatNpr(purchase.amount)}</span>
              </div>
            ))}
          </div>
        </InfoPanel>
      </div>
    </AppShell>
  );
}
