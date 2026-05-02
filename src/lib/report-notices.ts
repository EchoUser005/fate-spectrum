import type { BirthInput } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";

export function buildReportNotices(birth: BirthInput, provider: ProviderConfig) {
  const notices: string[] = [];

  if (birth.useTrueSolarTime && (birth.latitude === undefined || birth.longitude === undefined)) {
    notices.push("已保留真太阳时校准；当前未提供经纬度，本次报告暂不做校正。");
  }

  if (provider.provider === "custom-paipan") {
    notices.push("当前真实排盘仅支持公历生日与男/女；海外时区换算将在后续版本支持。");
  }

  return notices;
}
