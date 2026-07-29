import { AppShell, ActionLink, InfoPanel, PageTitle } from "@/app/components";
import { getAppUrl } from "@/lib/format";

export default async function Home() {
  const cardUrl = `${getAppUrl()}/nfc/lvd-card-001`;

  return (
    <AppShell>
      <PageTitle
        eyebrow="Demo flow"
        title="One NFC card, three controlled views."
        description="The NFC card stores only this website URL. The app decides whether to show public profile, customer account, or staff customer details based on login state."
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <InfoPanel>
          <h2 className="text-xl font-black">URL to write into NFC Tools</h2>
          <p className="mt-3 break-all rounded-md bg-neutral-100 p-4 font-mono text-sm">{cardUrl}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ActionLink href="/nfc/lvd-card-001">Open NFC card demo</ActionLink>
            <ActionLink href="/login/customer" variant="secondary">
              Customer login
            </ActionLink>
            <ActionLink href="/login/staff" variant="secondary">
              Staff login
            </ActionLink>
          </div>
        </InfoPanel>

        <InfoPanel>
          <h2 className="text-xl font-black">Demo credentials</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-bold">Customer</p>
              <p className="text-neutral-600">Phone: 9800000001</p>
              <p className="text-neutral-600">PIN: 1111</p>
            </div>
            <div>
              <p className="font-bold">Staff</p>
              <p className="text-neutral-600">Email: staff@lvd.com</p>
              <p className="text-neutral-600">PIN: 2222</p>
            </div>
          </div>
        </InfoPanel>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Public visitor", "Sees only name and LVD member label."],
          ["Customer", "Logs in and sees own account from card tap."],
          ["LVD staff", "Logs in and sees customer phone, tier, and purchases."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-md border border-neutral-200 bg-white p-5">
            <h3 className="font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
