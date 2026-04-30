import { z } from "zod";
import { TIME_BRANCHES } from "@/lib/constants";

export const BirthInputSchema = z.object({
  nickname: z.string().trim().max(40).optional(),
  gender: z.enum(["male", "female", "other", "unknown"]),
  calendar: z.enum(["solar", "lunar"]),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "birthDate must be YYYY-MM-DD"),
  birthTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "birthTime must be HH:mm")
    .optional()
    .or(z.literal("")),
  timeBranch: z.enum(TIME_BRANCHES),
  timezone: z.string().trim().min(1),
  birthPlace: z.string().trim().max(120).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  useTrueSolarTime: z.boolean()
});

export type BirthInput = z.infer<typeof BirthInputSchema>;
