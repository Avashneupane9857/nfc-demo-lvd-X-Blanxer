import { AppShell, InfoPanel, PageTitle, Stat } from "@/app/components";
import { getCardProfileByCardId } from "@/lib/queries";
import { formatNpr } from "@/lib/format";
import { requireStaff } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function StaffCustomerPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  await requireStaff();
  const profile = await getCardProfileByCardId(cardId);

  if (!profile) {
    return (
      <AppShell>
        <PageTitle
          eyebrow="Staff lookup"
          title="Card not found"
          description="No customer is linked with this NFC card ID."
        />
      </AppShell>
    );
  }

  const totalSpend = profile.purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <AppShell>
      <PageTitle
        eyebrow="Staff customer lookup"
        title={profile.customer.fullName}
        description="This private view is only available after staff login."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="Phone" value={profile.customer.phone} />
        <Stat label="Member type" value={profile.customer.memberType} />
        <Stat label="Card status" value={profile.card.status} />
        <Stat label="Total spend" value={formatNpr(totalSpend)} />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
        <InfoPanel>
          <h2 className="text-xl font-black">Customer record</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-bold">Email</dt>
              <dd className="text-neutral-600">{profile.customer.email}</dd>
            </div>
            <div>
              <dt className="font-bold">NFC card ID</dt>
              <dd className="text-neutral-600">{profile.card.cardUid}</dd>
            </div>
            <div>
              <dt className="font-bold">Public title</dt>
              <dd className="text-neutral-600">{profile.customer.publicTitle}</dd>
            </div>
          </dl>
        </InfoPanel>

        <InfoPanel>
          <h2 className="text-xl font-black">Purchase history</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-neutral-200">
            {profile.purchases.map((purchase) => (
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
