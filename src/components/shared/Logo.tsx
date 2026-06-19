import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={cn("flex items-center gap-1.5 group", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 text-primary"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.343 8.28"
            transform="translate(2,2) scale(0.84)"
          />
        </svg>
      </div>
      <div className={cn("font-bold tracking-tight", sizes[size])}>
        <span className="text-primary">Chain</span>
        <span className="text-foreground">Market</span>
      </div>
    </Link>
  );
}
