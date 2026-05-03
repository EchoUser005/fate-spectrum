import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sampleReport from "@/fixtures/sample-report.json";
import {
  loadProfiles,
  profilesFromMemoryPayload,
  saveProfileReport
} from "@/lib/client/profile-storage";
import { ReportResponseSchema, type ReportResponse } from "@/lib/schemas/report";

const ownerReport = ReportResponseSchema.parse(sampleReport);

describe("memory profile payload mapping", () => {
  it("maps owner and guest report snapshots into frontend profile records", () => {
    const profiles = profilesFromMemoryPayload({
      owner: {
        profileId: "echo",
        nickname: "echo",
        generatedAt: "2026-05-03T00:00:00.000Z",
        report: sampleReport
      },
      guests: [
        {
          profileId: "guest-a",
          nickname: "朋友A",
          generatedAt: "2026-05-03T00:00:00.000Z",
          report: {
            ...sampleReport,
            birth: {
              ...sampleReport.birth,
              nickname: "朋友A"
            }
          }
        }
      ]
    });

    expect(profiles).toHaveLength(2);
    expect(profiles[0]).toMatchObject({
      id: "owner-echo",
      label: "echo",
      isPrimary: true
    });
    expect(profiles[1]).toMatchObject({
      id: "guest-guest-a",
      label: "朋友A",
      isPrimary: false
    });
  });

  it("ignores backend profile records that do not yet have report snapshots", () => {
    const profiles = profilesFromMemoryPayload({
      owner: {
        profileId: "echo",
        nickname: "echo",
        birth: { calendar: "solar" }
      },
      guests: []
    });

    expect(profiles).toEqual([]);
  });
});

describe("local profile role storage", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      localStorage: createMemoryStorage(),
      sessionStorage: createMemoryStorage()
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps owner as a singleton and appends generated guest profiles", () => {
    saveProfileReport(ownerReport, "owner");
    saveProfileReport(withNickname(ownerReport, "新命主"), "owner");
    saveProfileReport(withNickname(ownerReport, "缘主A"), "guest");

    const profiles = loadProfiles();
    expect(profiles).toHaveLength(2);
    expect(profiles[0]).toMatchObject({
      label: "新命主",
      isPrimary: true
    });
    expect(profiles[1]).toMatchObject({
      label: "缘主A",
      isPrimary: false
    });
  });

  it("requires an owner before storing a guest locally", () => {
    expect(() => saveProfileReport(withNickname(ownerReport, "缘主A"), "guest")).toThrow(/先创建命主/);
  });
});

function withNickname(report: ReportResponse, nickname: string): ReportResponse {
  return ReportResponseSchema.parse({
    ...report,
    birth: {
      ...report.birth,
      nickname
    }
  });
}

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    }
  };
}
