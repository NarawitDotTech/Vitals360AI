import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-pill font-medium transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-terracotta text-white hover:bg-terracotta-hover hover:shadow-md hover:-translate-y-0.5":
            variant === "default",
          "border-2 border-border bg-white text-ink hover:border-terracotta hover:text-terracotta":
            variant === "outline",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-5 py-2.5 text-base": size === "md",
          "px-8 py-3.5 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
