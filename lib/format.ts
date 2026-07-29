export function formatNpr(amount: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://nfc-demo-lvd-x-blanxer.vercel.app";
}
