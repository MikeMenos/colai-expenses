"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  currentMonth,
  formatMonthLabel,
  monthOptions,
  shiftMonth,
} from "@/lib/month";

const MONTH_RANGE = 24;

/** `inverted` sits on the dark balance hero; `default` on a light surface. */
type Tone = "default" | "inverted";

const TONES: Record<Tone, { shell: string; arrow: string; trigger: string }> = {
  default: {
    shell: "bg-surface-blue",
    arrow:
      "text-accent-blue-ink/70 hover:bg-background hover:text-accent-blue-ink",
    trigger:
      "text-accent-blue-ink hover:bg-background/80 data-[popup-open]:bg-background [&_svg]:text-accent-blue-ink/60!",
  },
  inverted: {
    shell: "bg-white/12 ring-1 ring-white/15 backdrop-blur-sm",
    arrow:
      "text-white/80 hover:bg-white/20 hover:text-white disabled:opacity-40 focus-visible:ring-white/60",
    trigger:
      "text-white hover:bg-white/15 data-[popup-open]:bg-white/20 focus-visible:border-white/70 focus-visible:ring-white/50 [&_svg]:text-white/80!",
  },
};

type MonthSelectorProps = {
  value: string;
  onChange: (month: string) => void;
  tone?: Tone;
  className?: string;
};

/**
 * Compact month control: arrow stepping plus the full list.
 * The newer arrow stops at the current month, matching the available options.
 */
export function MonthSelector({
  value,
  onChange,
  tone = "default",
  className,
}: MonthSelectorProps) {
  const options = useMemo(() => {
    const recent = monthOptions(MONTH_RANGE);
    if (recent.some((opt) => opt.value === value)) return recent;
    return [{ value, label: formatMonthLabel(value) }, ...recent];
  }, [value]);

  const canGoNewer = value < currentMonth();
  const styles = TONES[tone];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full p-1",
        styles.shell,
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn("rounded-full", styles.arrow)}
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label="Προηγούμενος μήνας"
      >
        <ChevronLeft />
      </Button>

      <Select
        items={options}
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Επιλογή μήνα"
          className={cn(
            "h-7 min-w-[10rem] justify-center rounded-full border-transparent bg-transparent px-2.5 font-medium dark:bg-transparent",
            styles.trigger,
          )}
        >
          <SelectValue placeholder="Επιλέξτε μήνα" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn("rounded-full", styles.arrow)}
        onClick={() => onChange(shiftMonth(value, 1))}
        disabled={!canGoNewer}
        aria-label="Επόμενος μήνας"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
