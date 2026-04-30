import { z } from "zod";

const StarArraySchema = z.array(z.string()).optional();

export const ZiweiPalaceSchema = z
  .object({
    MangA: z.string().optional(),
    MangB: z.string().optional(),
    MangC: z.string().optional(),
    GongWei: z.number().optional(),
    ganzhi: z
      .object({
        tg: z.number(),
        dz: z.number()
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
    status: z.string(),
    message: z.string().optional(),
    data: z
      .object({
        zw: z.array(ZiweiPalaceSchema).optional(),
        bz: z
          .object({
            y: z.string(),
            m: z.string(),
            d: z.string(),
            h: z.string(),
            dayunStartDay: z.string().optional(),
            dayunGZ: z.array(z.string()).optional(),
            dayunAge: z.array(z.number()).optional(),
            dayunYear: z.array(z.number()).optional()
          })
          .partial()
          .optional(),
        solarday: z.string().optional(),
        lunarday: z.string().optional(),
        shenxiao: z.string().optional(),
        age: z.number().optional(),
        mingzhu: z.string().optional(),
        shenzhu: z.string().optional(),
        fiveelement: z.string().optional(),
        yinyanggender: z.string().optional(),
        output: z.record(z.string(), z.string()).optional()
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
