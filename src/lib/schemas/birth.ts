import { z } from "zod";
import { TIME_BRANCHES } from "@/lib/constants";

export const BirthInputSchema = z.object({
  nickname: z.string().trim().max(40).optional(),
  gender: z.enum(["male", "female", "other", "unknown"]),
  calendar: z.enum(["solar", "lunar"]),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "请填写公历生日")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const parsed = new Date(year, month - 1, day);
      return (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      );
    }, "请填写有效生日"),
  birthTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "请填写出生时间")
    .refine((value) => {
      const [hour, minute] = value.split(":").map(Number);
      return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    }, "请填写有效出生时间"),
  timeBranch: z.enum(TIME_BRANCHES),
  timezone: z.string().trim().min(1),
  birthPlace: z.string().trim().max(120).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  useTrueSolarTime: z.boolean()
});

export type BirthInput = z.infer<typeof BirthInputSchema>;
