import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  color?: "green" | "yellow" | "red" | "terracotta";
}

export function Progress({ value, className, color = "terracotta" }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full bg-surface rounded-pill h-2 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-pill transition-all duration-300", {
          "bg-terracotta": color === "terracotta",
          "bg-green-500": color === "green",
          "bg-yellow-500": color === "yellow",
          "bg-red-500": color === "red",
        })}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
