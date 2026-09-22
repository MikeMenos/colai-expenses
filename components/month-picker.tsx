"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { monthOptions } from "@/lib/month";

type MonthPickerProps = {
  value: string;
  onChange: (month: string) => void;
  label?: string;
};

export function MonthPicker({ value, onChange, label = "Μήνας" }: MonthPickerProps) {
  const options = monthOptions(24);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <Select
        items={options}
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Επιλέξτε μήνα" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
