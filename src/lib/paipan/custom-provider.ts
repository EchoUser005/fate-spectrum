import dns from "node:dns/promises";
import net from "node:net";
import { DEFAULT_SHENJIGE_ENDPOINT } from "@/lib/constants";
import { allowInsecureProviderEndpoint } from "@/lib/config/providers";
import type { BirthInput } from "@/lib/schemas/birth";
import type { PaipanResponse } from "@/lib/schemas/paipan";
import type { ProviderConfig } from "@/lib/schemas/provider";
import { coercePaipanResponse } from "@/lib/paipan/normalize";
import type { PaipanProvider } from "@/lib/paipan/providers";

export const customPaipanProvider: PaipanProvider = {
  id: "custom-paipan",
  name: "Custom Paipan",
  async generate(input: BirthInput, config: ProviderConfig): Promise<PaipanResponse> {
    const endpoint = config.paipanEndpoint || DEFAULT_SHENJIGE_ENDPOINT;
    await assertAllowedEndpoint(endpoint);

    if (isShenjigeEndpoint(endpoint)) {
      assertShenjigeInput(input);
      return callShenjigeProvider(input, endpoint);
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        birth: input,
        options: {
          includeZiwei: true,
          includeBazi: true,
          includeDayun: true,
          includeLiunian: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Paipan provider failed with HTTP ${response.status}`);
    }

    return coercePaipanResponse(await response.json());
  }
};

export function buildShenjigeFormBody(input: BirthInput) {
  const [year, month, day] = input.birthDate.split("-").map(Number);
  const clock = getClockTime(input);
  const params = new URLSearchParams();
  params.set("year", String(year));
  params.set("month", String(month));
  params.set("day", String(day));
  params.set("hour", input.timeBranch);
  params.set("h", String(clock.hour));
  params.set("m", String(clock.minute));
  params.set("genderValue", input.gender === "female" ? "F" : "M");
  params.set("settings[sihua]", "D");
  params.set("settings[brightness]", "D");
  params.set("settings[isShowDStarBright]", "NO");
  params.set("settings[JKXK]", "D");
  params.set("settings[RYType]", "M");
  params.set("settings[RYTypeM45]", "false");
  params.set("zzpAnalysis", "N");
  return params;
}

export function assertShenjigeInput(input: BirthInput) {
  if (input.calendar !== "solar") {
    throw new Error("真实 shenjige provider 的 MVP 暂只支持公历输入，农历转换列为 TODO。");
  }
  if (input.gender !== "male" && input.gender !== "female") {
    throw new Error("真实 shenjige provider 需要选择 male 或 female。");
  }
}

export function isShenjigeEndpoint(endpoint: string) {
  try {
    const url = new URL(endpoint);
    return url.hostname === "www.shenjige.cn" && url.pathname.includes("/api/ziwei/getPlateArrangement");
  } catch {
    return false;
  }
}

async function callShenjigeProvider(input: BirthInput, endpoint: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: buildShenjigeFormBody(input)
  });

  if (!response.ok) {
    throw new Error(`Paipan provider failed with HTTP ${response.status}`);
  }

  const paipan = coercePaipanResponse(await response.json());
  if (!isSuccessfulProviderStatus(paipan.status)) {
    throw new Error(`shenjige provider returned status ${paipan.status}: ${paipan.message || "unknown error"}`);
  }
  return paipan;
}

export async function assertAllowedEndpoint(endpoint: string) {
  const insecureAllowed = allowInsecureProviderEndpoint();
  const url = new URL(endpoint);

  if (!insecureAllowed && url.protocol !== "https:") {
    throw new Error("Custom paipan endpoint must use https unless explicitly allowed for local development.");
  }

  if (insecureAllowed) {
    return;
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Custom paipan endpoint cannot target localhost by default.");
  }

  const directIpType = net.isIP(hostname);
  if (directIpType && isPrivateIp(hostname)) {
    throw new Error("Custom paipan endpoint cannot target private or loopback IP ranges by default.");
  }

  if (!directIpType) {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    for (const record of records) {
      if (isPrivateIp(record.address)) {
        throw new Error("Custom paipan endpoint resolved to a private or loopback IP range.");
      }
    }
  }
}

function isPrivateIp(address: string) {
  if (address === "0.0.0.0" || address === "::" || address === "::1") return true;
  if (address.startsWith("127.") || address.startsWith("169.254.")) return true;
  if (address.startsWith("10.") || address.startsWith("192.168.")) return true;
  if (address.startsWith("172.")) {
    const second = Number(address.split(".")[1]);
    return second >= 16 && second <= 31;
  }
  if (address.toLowerCase().startsWith("fc") || address.toLowerCase().startsWith("fd")) return true;
  return false;
}

function getClockTime(input: BirthInput) {
  const match = input.birthTime?.match(/^(\d{2}):(\d{2})$/);
  if (match) {
    return {
      hour: Number(match[1]),
      minute: Number(match[2])
    };
  }

  const branchHour: Record<BirthInput["timeBranch"], number> = {
    子: 23,
    丑: 1,
    寅: 3,
    卯: 5,
    辰: 7,
    巳: 9,
    午: 11,
    未: 13,
    申: 15,
    酉: 17,
    戌: 19,
    亥: 21
  };

  return {
    hour: branchHour[input.timeBranch],
    minute: 0
  };
}

function isSuccessfulProviderStatus(status: string) {
  return status === "200" || status.toLowerCase() === "success" || status.toLowerCase() === "ok";
}
