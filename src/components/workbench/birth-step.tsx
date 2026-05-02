"use client";

import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { TIME_BRANCHES } from "@/lib/constants";
import type { BirthInput } from "@/lib/schemas/birth";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function BirthStep({ form }: { form: UseFormReturn<BirthInput> }) {
  const {
    register,
    formState: { errors }
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="昵称">
        <Input placeholder="匿名样例" {...register("nickname")} />
      </Field>
      <Field label="性别">
        <Select {...register("gender")}>
          <option value="female">女</option>
          <option value="male">男</option>
        </Select>
      </Field>
      <Field label="公历生日" error={errors.birthDate?.message}>
        <Input type="date" {...register("birthDate")} />
      </Field>
      <Field label="出生时辰">
        <Select {...register("timeBranch")}>
          {TIME_BRANCHES.map((branch) => (
            <option key={branch} value={branch}>
              {branch}时
            </option>
          ))}
        </Select>
      </Field>
      <Field label="出生时间">
        <Input type="time" {...register("birthTime")} />
      </Field>
      <Field label="出生地，可选">
        <Input placeholder="上海" {...register("birthPlace")} />
      </Field>
      <label className="flex items-center gap-2 rounded-md border border-fs-line bg-white px-3 py-3 text-sm font-medium text-fs-ink sm:col-span-2">
        <input type="checkbox" className="h-4 w-4 rounded border-fs-line" {...register("useTrueSolarTime")} />
        真太阳时校准，可选
      </label>
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
