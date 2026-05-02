"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BirthInput } from "@/lib/schemas/birth";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const TIME_BRANCH_META: Record<BirthInput["timeBranch"], { range: string }> = {
  子: { range: "23:00-00:59" },
  丑: { range: "01:00-02:59" },
  寅: { range: "03:00-04:59" },
  卯: { range: "05:00-06:59" },
  辰: { range: "07:00-08:59" },
  巳: { range: "09:00-10:59" },
  午: { range: "11:00-12:59" },
  未: { range: "13:00-14:59" },
  申: { range: "15:00-16:59" },
  酉: { range: "17:00-18:59" },
  戌: { range: "19:00-20:59" },
  亥: { range: "21:00-22:59" }
};

export function BirthStep({ form }: { form: UseFormReturn<BirthInput> }) {
  const {
    register,
    formState: { errors }
  } = form;
  const [dateParts, setDateParts] = useState(() => splitDate(form.getValues("birthDate")));
  const [timeParts, setTimeParts] = useState(() => splitTime(form.getValues("birthTime")));
  const birthTime = form.watch("birthTime");
  const selectedBranch = form.watch("timeBranch");
  const inferredBranch = inferTimeBranch(birthTime);
  const inferredMeta = inferredBranch ? TIME_BRANCH_META[inferredBranch] : null;

  useEffect(() => {
    if (inferredBranch && inferredBranch !== selectedBranch) {
      form.setValue("timeBranch", inferredBranch, { shouldDirty: true, shouldValidate: true });
    }
  }, [birthTime, form, inferredBranch, selectedBranch]);

  const updateDatePart = (part: keyof DateParts, rawValue: string) => {
    const next = {
      ...dateParts,
      [part]: rawValue
    };
    if ((part === "year" || part === "month") && next.day) {
      const maxDay = getDaysInMonth(next.year, next.month);
      if (maxDay && Number(next.day) > maxDay) next.day = String(maxDay).padStart(2, "0");
    }
    setDateParts(next);
    form.setValue("birthDate", composeDate(next), { shouldDirty: true, shouldValidate: true });
  };

  const updateTimePart = (part: keyof TimeParts, rawValue: string) => {
    const next = {
      ...timeParts,
      [part]: rawValue
    };
    if (part === "hour" && rawValue && !next.minute) next.minute = "00";
    setTimeParts(next);
    form.setValue("birthTime", composeTime(next), { shouldDirty: true, shouldValidate: true });
  };

  const dayOptions = getDayOptions(dateParts.year, dateParts.month);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="昵称">
        <Input placeholder="匿名" {...register("nickname")} />
      </Field>
      <Field label="性别">
        <Select {...register("gender")}>
          <option value="female">女</option>
          <option value="male">男</option>
        </Select>
      </Field>
      <div className="grid gap-1 text-sm font-medium text-fs-ink sm:col-span-2">
        <p>公历生日</p>
        <input type="hidden" {...register("birthDate")} />
        <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr] gap-2">
          <OptionBox
            ariaLabel="出生年份"
            suffix="年"
            value={dateParts.year}
            onChange={(value) => updateDatePart("year", value)}
            options={YEAR_OPTIONS}
          />
          <OptionBox
            ariaLabel="出生月份"
            suffix="月"
            value={dateParts.month}
            onChange={(value) => updateDatePart("month", value)}
            options={MONTH_OPTIONS}
          />
          <OptionBox
            ariaLabel="出生日期"
            suffix="日"
            value={dateParts.day}
            onChange={(value) => updateDatePart("day", value)}
            options={dayOptions}
          />
        </div>
        {errors.birthDate?.message ? <span className="text-xs text-fs-rose">{errors.birthDate.message}</span> : null}
      </div>
      <div className="grid gap-1 text-sm font-medium text-fs-ink sm:col-span-2">
        <p>出生时间</p>
        <input type="hidden" {...register("birthTime")} />
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <OptionBox
              ariaLabel="出生小时"
              suffix="时"
              value={timeParts.hour}
              onChange={(value) => updateTimePart("hour", value)}
              options={HOUR_OPTIONS}
            />
            <OptionBox
              ariaLabel="出生分钟"
              suffix="分"
              value={timeParts.minute}
              onChange={(value) => updateTimePart("minute", value)}
              options={MINUTE_OPTIONS}
            />
          </div>
          <div
            id="time-branch-preview"
            className="flex items-center justify-between gap-3 rounded-md border border-fs-line bg-white px-3 py-3"
          >
            <div>
              <p className="text-xs font-medium text-fs-muted">自动换算时辰</p>
              <p className="mt-0.5 text-sm text-fs-muted">
                {inferredMeta ? inferredMeta.range : "填写小时后立即显示"}
              </p>
            </div>
            <div className="rounded-full bg-fs-surface px-3 py-1 text-sm font-semibold text-fs-ink">
              {inferredBranch ? `${inferredBranch}时` : "待推算"}
            </div>
          </div>
        </div>
        {errors.birthTime?.message ? <span className="text-xs text-fs-rose">{errors.birthTime.message}</span> : null}
      </div>
      <Field label="出生地">
        <Input placeholder="上海" {...register("birthPlace")} />
      </Field>
      <input type="hidden" {...register("timeBranch")} />
      <label className="flex items-center gap-2 rounded-md border border-fs-line bg-white px-3 py-3 text-sm font-medium text-fs-ink sm:col-span-2">
        <input type="checkbox" className="h-4 w-4 rounded border-fs-line" {...register("useTrueSolarTime")} />
        真太阳时校准
      </label>
    </div>
  );
}

type DateParts = {
  year: string;
  month: string;
  day: string;
};

type TimeParts = {
  hour: string;
  minute: string;
};

const YEAR_OPTIONS = buildYearOptions();
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => pad2(String(index + 1)));
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => pad2(String(index)));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => pad2(String(index)));

function splitDate(value?: string): DateParts {
  const [year = "", month = "", day = ""] = value?.split("-") ?? [];
  return { year, month, day };
}

function splitTime(value?: string): TimeParts {
  const [hour = "", minute = ""] = value?.split(":") ?? [];
  return { hour, minute };
}

function composeDate(parts: DateParts) {
  if (parts.year.length !== 4 || !parts.month || !parts.day) return "";
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

function composeTime(parts: TimeParts) {
  if (!parts.hour) return "";
  return `${pad2(parts.hour)}:${pad2(parts.minute || "00")}`;
}

function pad2(value: string) {
  return value.padStart(2, "0");
}

function buildYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1899 }, (_, index) => String(currentYear - index));
}

function getDayOptions(year: string, month: string) {
  const days = getDaysInMonth(year, month) ?? 31;
  return Array.from({ length: days }, (_, index) => pad2(String(index + 1)));
}

function getDaysInMonth(year: string, month: string) {
  if (!month) return null;
  const parsedYear = year.length === 4 ? Number(year) : 2000;
  const parsedMonth = Number(month);
  if (!parsedMonth || parsedMonth < 1 || parsedMonth > 12) return null;
  return new Date(parsedYear, parsedMonth, 0).getDate();
}

function inferTimeBranch(value?: string) {
  const match = value?.match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  if (hour === 23 || hour === 0) return "子";
  if (hour >= 1 && hour <= 2) return "丑";
  if (hour >= 3 && hour <= 4) return "寅";
  if (hour >= 5 && hour <= 6) return "卯";
  if (hour >= 7 && hour <= 8) return "辰";
  if (hour >= 9 && hour <= 10) return "巳";
  if (hour >= 11 && hour <= 12) return "午";
  if (hour >= 13 && hour <= 14) return "未";
  if (hour >= 15 && hour <= 16) return "申";
  if (hour >= 17 && hour <= 18) return "酉";
  if (hour >= 19 && hour <= 20) return "戌";
  if (hour >= 21 && hour <= 22) return "亥";
  return null;
}

function OptionBox({
  ariaLabel,
  suffix,
  value,
  onChange,
  options
}: {
  ariaLabel: string;
  suffix: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Select
        aria-label={ariaLabel}
        className="h-12 text-base"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">选择{suffix}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
            {suffix}
          </option>
        ))}
      </Select>
    </div>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium text-fs-ink">
      {label}
      {children}
      {error ? <span className="text-xs text-fs-rose">{error}</span> : null}
    </label>
  );
}
