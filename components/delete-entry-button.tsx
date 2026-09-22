"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateEl } from "@/lib/format";
import type { ExpenseEntry } from "@/lib/types";

type DeleteEntryButtonProps = {
  entry: ExpenseEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  className?: string;
  size?: "icon-sm" | "icon";
};

export function DeleteEntryButton({
  entry,
  onDelete,
  isDeleting,
  className,
  size = "icon-sm",
}: DeleteEntryButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      disabled={isDeleting}
      onClick={() => {
        if (
          window.confirm(
            `Διαγραφή καταχώρησης για ${formatDateEl(entry.date)};`,
          )
        ) {
          onDelete(entry.id);
        }
      }}
      aria-label={`Διαγραφή καταχώρησης ${formatDateEl(entry.date)}`}
      className={cn(
        "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
    >
      <Trash2 />
    </Button>
  );
}
