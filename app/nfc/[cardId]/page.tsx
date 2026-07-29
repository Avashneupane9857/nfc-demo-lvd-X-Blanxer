import { redirect } from "next/navigation";
import { AppShell, ActionLink, InfoPanel, PageTitle } from "@/app/components";
import { getCardProfileByCardId } from "@/lib/queries";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NfcCardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const [profile, session] = await Promise.all([
    getCardProfileByCardId(cardId),
    getCurrentSession(),
  ]);

  if (!profile) {
    return (
      <AppShell>
        <PageTitle
          eyebrow="NFC card"
          title="Card not found"
          description="This card ID is not linked to any demo customer."
        />
        <ActionLink href="/" variant="secondary">
          Back to demo home
        </ActionLink>
      </AppShell>
    );
  }

  if (session?.role === "staff") {
    redirect(`/staff/customer/${cardId}`);
  }

  if (session?.role === "customer" && session.userId === profile.customer.id) {
    redirect("/account");
  }

  return (
    <AppShell>
      <PageTitle
        eyebrow="Public NFC profile"
        title={profile.customer.fullName}
        description="This is the safe public view shown to friends or anyone who taps the card without logging in."
      />

      <div className="grid gap-5 lg:grid-cols-[0.6fr_0.4fr]">
        <InfoPanel>
          <div className="flex min-h-64 flex-col justify-between rounded-md border border-neutral-200 bg-neutral-950 p-6 text-white">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-300">LVD</p>
              <h2 className="mt-8 text-4xl font-black">{profile.customer.fullName}</h2>
            </div>
            <p className="text-lg font-semibold">{profile.customer.publicTitle}</p>
          </div>
        </InfoPanel>

        <InfoPanel>
          <h2 className="text-xl font-black">Private data hidden</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Public users cannot see phone number, email, member tier, or purchases from this NFC link.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ActionLink href="/login/customer" variant="secondary">
              Customer login
            </ActionLink>
            <ActionLink href="/login/staff" variant="secondary">
              Staff login
            </ActionLink>
          </div>
        </InfoPanel>
      </div>
    </AppShell>
  );
}
