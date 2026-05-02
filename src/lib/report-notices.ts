import type { BirthInput } from "@/lib/schemas/birth";

export function buildReportNotices(birth: BirthInput) {
  const notices: string[] = [];

  if (birth.useTrueSolarTime && (birth.latitude === undefined || birth.longitude === undefined)) {
    notices.push("已保留真太阳时校准；当前未提供经纬度，本次报告暂不做校正。");
  }

  return notices;
}
