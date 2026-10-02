import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Flame,
  Gem,
  Landmark,
  Mountain,
  Palette,
  Star,
  Store,
  Trees,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/** Categories, with the soft tint used for generated cover art. */
export const CATEGORIES = [
  {
    value: "history",
    label: "History",
    icon: Landmark,
    tint: "from-[#f1ece3] to-[#e2d9c9]",
    darkTint: "dark:from-[#2b2820] dark:to-[#211f19]",
  },
  {
    value: "nature",
    label: "Nature",
    icon: Trees,
    tint: "from-[#e8f1e9] to-[#d5e6da]",
    darkTint: "dark:from-[#1e2a22] dark:to-[#182119]",
  },
  {
    value: "market",
    label: "Markets",
    icon: Store,
    tint: "from-[#f4ece6] to-[#ead7ca]",
    darkTint: "dark:from-[#2b241f] dark:to-[#211b17]",
  },
  {
    value: "food",
    label: "Food",
    icon: UtensilsCrossed,
    tint: "from-[#f9efe1] to-[#f2dfc1]",
    darkTint: "dark:from-[#2c2519] dark:to-[#221d14]",
  },
  {
    value: "culture",
    label: "Culture",
    icon: Palette,
    tint: "from-[#efeaf3] to-[#e0d8ed]",
    darkTint: "dark:from-[#26222f] dark:to-[#1d1a25]",
  },
  {
    value: "spiritual",
    label: "Spiritual",
    icon: Flame,
    tint: "from-[#f8ebe6] to-[#f0d8cf]",
    darkTint: "dark:from-[#2c231f] dark:to-[#221b18]",
  },
  {
    value: "adventure",
    label: "Adventure",
    icon: Mountain,
    tint: "from-[#e7eff4] to-[#d2e2ec]",
    darkTint: "dark:from-[#1d262d] dark:to-[#171e24]",
  },
  {
    value: "hidden",
    label: "Hidden",
    icon: Gem,
    tint: "from-[#f7f2de] to-[#eee1b6]",
    darkTint: "dark:from-[#2a2619] dark:to-[#211e14]",
  },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const BUDGETS = [
  { value: "free", label: "Free" },
  { value: "budget", label: "₹ Budget" },
  { value: "moderate", label: "₹₹ Moderate" },
  { value: "splurge", label: "₹₹₹ Splurge" },
] as const;

export function categoryMeta(value: string) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0];
}

export function budgetLabel(value: string) {
  return BUDGETS.find((b) => b.value === value)?.label ?? value;
}

/** Initials for avatar chips. */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/**
 * Generated cover art — a soft category tint with a ghosted icon. When a real
 * photo is available it renders on top, and silently falls back to the tint if
 * the image fails to load.
 */
export function PlaceCover({
  category,
  hiddenGem = false,
  image,
  alt = "",
  className,
  iconSize = "size-24",
}: {
  category: string;
  hiddenGem?: boolean;
  image?: string | null;
  alt?: string;
  className?: string;
  iconSize?: string;
}) {
  const meta = categoryMeta(category);
  const Icon = meta.icon;
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        meta.tint,
        meta.darkTint,
        className,
      )}
    >
      {image && (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <div className="grain absolute inset-0 opacity-60" />
      <Icon
        aria-hidden
        className={cn(
          "absolute -bottom-3 -right-2 text-foreground/10 drop-shadow-sm",
          iconSize,
        )}
        strokeWidth={1.1}
      />
      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-background/70 px-2 py-0.5 text-[11px] font-medium text-foreground/80 backdrop-blur-sm">
          <meta.icon className="size-3" />
          {meta.label}
        </span>
        {hiddenGem && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#8a6d1f]/90 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <Gem className="size-3" />
            Hidden gem
          </span>
        )}
      </div>
    </div>
  );
}

/** Compact star rating with numeric value and review count. */
export function Stars({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const rounded = Math.round(value);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(
              "size-3.5",
              n <= rounded
                ? "fill-[#d9a520] text-[#d9a520]"
                : "text-foreground/20",
            )}
          />
        ))}
      </span>
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count})</span>}
    </span>
  );
}

/** Verified-local indicator. */
export function VerifiedBadge({
  pending = false,
  className,
}: {
  pending?: boolean;
  className?: string;
}) {
  if (pending) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-[#c9a227]/40 bg-[#f7f1dc] px-2 py-0.5 text-[11px] font-medium text-[#8a6d1f] dark:bg-[#2a2619] dark:text-[#e0c96a]",
          className,
        )}
      >
        Verification pending
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary",
        className,
      )}
    >
      <BadgeCheck className="size-3.5" />
      Verified local
    </span>
  );
}

/** Initials avatar with the app's teal gradient. */
export function AvatarChip({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/85 to-primary text-sm font-semibold text-primary-foreground",
        className ?? "size-10",
      )}
    >
      {initials(name) || "?"}
    </span>
  );
}

export const CategoryIcon: LucideIcon = Landmark;
