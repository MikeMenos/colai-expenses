"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { routePresetLabel } from "@/lib/constants";

export function RouteLabel({
  route,
  className,
}: {
  route: string;
  className?: string;
}) {
  const preset = routePresetLabel(route);

  if (preset) {
    return (
      <Badge variant="secondary" className={className}>
        {preset}
      </Badge>
    );
  }

  return (
    <p className={cn("truncate text-muted-foreground", className)} title={route}>
      {route}
    </p>
  );
}
