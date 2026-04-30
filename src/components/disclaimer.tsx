import { GENERAL_DISCLAIMER, HEALTH_DISCLAIMER, WEALTH_DISCLAIMER } from "@/lib/constants";

export function Disclaimer() {
  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <p>{GENERAL_DISCLAIMER}</p>
      <p className="mt-2">{HEALTH_DISCLAIMER}</p>
      <p className="mt-2">{WEALTH_DISCLAIMER}</p>
    </section>
  );
}
