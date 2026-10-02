import { cn } from "@/lib/utils";

/**
 * Yatra Setu mark — an arch (setu = bridge) with a destination point above it,
 * drawn so it still reads at 16px.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("size-8", className)}
      fill="none"
    >
      <path
        d="M5 22.5Q16 7.5 27 22.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M4 27.5H28"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.3"
      />
      <circle cx="16" cy="10" r="3" fill="currentColor" />
    </svg>
  );
}

/** Wordmark used in headers and footers. */
export function Brand({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BrandMark className={cn("size-7 text-primary", markClassName)} />
      <span className="text-[15px] font-semibold tracking-tight">
        Yatra <span className="text-primary">Setu</span>
      </span>
    </span>
  );
}
