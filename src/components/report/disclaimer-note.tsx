import { GENERAL_DISCLAIMER, HEALTH_DISCLAIMER, WEALTH_DISCLAIMER } from "@/lib/constants";

export function DisclaimerNote() {
  return (
    <section className="rounded-md border border-fs-line bg-fs-surface p-5 text-sm leading-6 text-fs-muted">
      <h2 className="font-semibold text-fs-ink">说明</h2>
      <p className="mt-2">{GENERAL_DISCLAIMER}</p>
      <p className="mt-2">{HEALTH_DISCLAIMER}</p>
      <p className="mt-2">{WEALTH_DISCLAIMER}</p>
    </section>
  );
}
