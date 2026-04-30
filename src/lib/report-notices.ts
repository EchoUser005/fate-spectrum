import type { BirthInput } from "@/lib/schemas/birth";
import type { ProviderConfig } from "@/lib/schemas/provider";

export function buildReportNotices(birth: BirthInput, provider: ProviderConfig) {
  const notices: string[] = [];

  if (birth.useTrueSolarTime && (birth.latitude === undefined || birth.longitude === undefined)) {
    notices.push(
      provider.provider === "mock"
        ? "已保留真太阳时开关；当前未提供经纬度，Mock Demo 不做校正。"
        : "已保留真太阳时开关；当前未提供经纬度，真实 provider 暂不做真太阳时校正。"
    );
  }

  if (provider.provider === "custom-paipan") {
    notices.push("shenjige MVP 当前仅支持公历、male/female，暂不处理海外时区换算。");
  }

  return notices;
}
