"use client";

import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { TIME_BRANCHES } from "@/lib/constants";
import type { BirthInput } from "@/lib/schemas/birth";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function BirthForm({ form }: { form: UseFormReturn<BirthInput> }) {
  const {
    register,
    formState: { errors }
  } = form;

  return (
    <section className="rounded-md bg-white/92 p-5 shadow-spectrum ring-1 ring-slate-200">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Birth Input</p>
        <h2 className="text-xl font-semibold text-ink">生辰信息</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="昵称">
          <Input placeholder="匿名样例" {...register("nickname")} />
        </Field>
        <Field label="性别">
          <Select {...register("gender")}>
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="other">other</option>
            <option value="unknown">unknown</option>
          </Select>
        </Field>
        <Field label="历法">
          <Select {...register("calendar")}>
            <option value="solar">公历 solar</option>
            <option value="lunar">农历 lunar</option>
          </Select>
        </Field>
        <Field label="出生日期" error={errors.birthDate?.message}>
          <Input type="date" {...register("birthDate")} />
        </Field>
        <Field label="出生时间">
          <Input type="time" {...register("birthTime")} />
        </Field>
        <Field label="时辰">
          <Select {...register("timeBranch")}>
            {TIME_BRANCHES.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="时区">
          <Input placeholder="Asia/Shanghai" {...register("timezone")} />
        </Field>
        <Field label="出生地">
          <Input placeholder="Shanghai" {...register("birthPlace")} />
        </Field>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("useTrueSolarTime")} />
        启用真太阳时校正
      </label>
    </section>
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
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      {label}
      {children}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
