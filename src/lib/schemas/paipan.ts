import { z } from "zod";

const StarArraySchema = z
  .union([z.array(z.coerce.string()), z.coerce.string().transform((value) => (value ? [value] : []))])
  .optional();

const ProviderOutputSchema = z
  .record(z.string(), z.unknown())
  .transform((output): Record<string, string> =>
    Object.fromEntries(Object.entries(output).map(([key, value]) => [key, stringifyProviderOutput(value)]))
  );

export const ZiweiPalaceSchema = z
  .object({
    MangA: z.string().optional(),
    MangB: z.string().optional(),
    MangC: z.string().optional(),
    GongWei: z.coerce.number().optional(),
    ganzhi: z
      .object({
        tg: z.coerce.number(),
        dz: z.coerce.number()
      })
      .optional(),
    StarA: StarArraySchema,
    StarB: StarArraySchema,
    StarC: StarArraySchema,
    Star6: StarArraySchema,
    StarD: StarArraySchema,
    StarE: StarArraySchema,
    StarF: StarArraySchema,
    StarS: StarArraySchema,
    StarJ: StarArraySchema
  })
  .catchall(z.unknown());

export const PaipanResponseSchema = z
  .object({
    status: z.union([z.string(), z.number()]).transform(String),
    message: z.coerce.string().optional(),
    data: z
      .object({
        zw: z
          .union([z.array(ZiweiPalaceSchema), z.record(z.string(), ZiweiPalaceSchema).transform(Object.values)])
          .optional(),
        bz: z
          .object({
            y: z.coerce.string().optional(),
            m: z.coerce.string().optional(),
            d: z.coerce.string().optional(),
            h: z.coerce.string().optional(),
            dayunStartDay: z.coerce.string().optional(),
            dayunGZ: z.array(z.coerce.string()).optional(),
            dayunAge: z.array(z.coerce.number()).optional(),
            dayunYear: z.array(z.coerce.number()).optional()
          })
          .optional(),
        solarday: z.string().optional(),
        lunarday: z.string().optional(),
        shenxiao: z.string().optional(),
        age: z.number().optional(),
        mingzhu: z.string().optional(),
        shenzhu: z.string().optional(),
        fiveelement: z.string().optional(),
        yinyanggender: z.string().optional(),
        output: ProviderOutputSchema.optional()
      })
      .catchall(z.unknown())
  })
  .catchall(z.unknown());

export const NormalizedPalaceSchema = z.object({
  index: z.number(),
  name: z.string(),
  branch: z.string().optional(),
  stars: z.array(z.string()),
  raw: ZiweiPalaceSchema
});

export const NormalizedDayunSchema = z.object({
  index: z.number(),
  ganzhi: z.string(),
  age: z.number(),
  startYear: z.number(),
  endYear: z.number()
});

export const NormalizedPaipanSchema = z.object({
  pillars: z.object({
    year: z.string(),
    month: z.string(),
    day: z.string(),
    hour: z.string()
  }),
  dayun: z.array(NormalizedDayunSchema),
  palaces: z.array(NormalizedPalaceSchema),
  identity: z.object({
    solarday: z.string().optional(),
    lunarday: z.string().optional(),
    shenxiao: z.string().optional(),
    age: z.number().optional(),
    mingzhu: z.string().optional(),
    shenzhu: z.string().optional(),
    fiveelement: z.string().optional(),
    yinyanggender: z.string().optional()
  }),
  outputs: z.record(z.string(), z.string())
});

export type ZiweiPalace = z.infer<typeof ZiweiPalaceSchema>;
export type PaipanResponse = z.infer<typeof PaipanResponseSchema>;
export type NormalizedPaipan = z.infer<typeof NormalizedPaipanSchema>;
export type NormalizedDayun = z.infer<typeof NormalizedDayunSchema>;

function stringifyProviderOutput(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
