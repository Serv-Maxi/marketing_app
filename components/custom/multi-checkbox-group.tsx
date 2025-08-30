"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface MultiCheckboxOption {
  value: string;
  label: string;
}

interface MultiCheckboxGroupProps {
  label: string;
  options: MultiCheckboxOption[];
  values: string[] | undefined;
  onChange: (values: string[]) => void;
  columns?: number;
}

export function MultiCheckboxGroup({
  label,
  options,
  values = [],
  onChange,
  columns = 2,
}: MultiCheckboxGroupProps) {
  function toggle(val: string) {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  }
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div
        className={`grid gap-2`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <Checkbox
              checked={values.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
