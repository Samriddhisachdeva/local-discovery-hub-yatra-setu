import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { PlaceSheet } from "@/components/app/PlaceSheet";
import {
  budgetLabel,
  CATEGORIES,
  categoryMeta,
  PlaceCover,
  Stars,
} from "@/components/app/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Gem, MapPin, Search, SearchX } from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";

export function DiscoverView({
  initialQuery = "",
  onViewTrip,
}: {
  initialQuery?: string;
  onViewTrip: () => void;
}) {
  const places = useQuery(api.places.list);
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [destination, setDestination] = useState("all");
  const [hiddenOnly, setHiddenOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const destinations = useMemo(() => {
    if (!places) return [];
    return [...new Set(places.map((p) => p.destination))].sort();
  }, [places]);

  const filtered = useMemo(() => {
    if (!places) return [];
    const term = search.trim().toLowerCase();
    return places.filter((place) => {
      if (category !== "all" && place.category !== category) return false;
      if (destination !== "all" && place.destination !== destination)
        return false;
      if (hiddenOnly && !place.hiddenGem) return false;
      if (!term) return true;
      return [place.title, place.destination, place.summary, place.description]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [places, search, category, destination, hiddenOnly]);

  const selected =
    (selectedId ? places?.find((p) => p._id === selectedId) : undefined) ??
    null;

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setDestination("all");
    setHiddenOnly(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Discover local places
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {places
              ? `${filtered.length} of ${places.length} places — popular landmarks and the ones locals keep quiet about.`
              : "Loading places contributed by locals…"}
          </p>
        </div>
        <label className="flex items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm shadow-xs">
          <Gem
            className={cn(
              "size-4",
              hiddenOnly ? "text-primary" : "text-muted-foreground",
            )}
          />
          Hidden gems only
          <Switch checked={hiddenOnly} onCheckedChange={setHiddenOnly} />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a destination, place or experience…"
              className="pl-9"
            />
          </div>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-full sm:w-52">
              <MapPin className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All destinations</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <CategoryChip
            active={category === "all"}
            label="All"
            onClick={() => setCategory("all")}
          />
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.value}
              active={category === cat.value}
              label={cat.label}
              icon={cat.icon}
              onClick={() => setCategory(cat.value)}
            />
          ))}
        </div>
      </div>

      {!places ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border/70"
            >
              <Skeleton className="h-36 w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <p className="mt-4 font-medium">No places match those filters</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try a different destination, or clear the filters to see everything
            the community has shared.
          </p>
          <Button variant="outline" className="mt-5" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => (
            <PlaceCard
              key={place._id}
              place={place}
              onOpen={() => setSelectedId(place._id)}
            />
          ))}
        </div>
      )}

      <PlaceSheet
        place={selected}
        onClose={() => setSelectedId(null)}
        onViewTrip={onViewTrip}
      />
    </div>
  );
}

function CategoryChip({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      {label}
    </button>
  );
}

function PlaceCard({
  place,
  onOpen,
}: {
  place: Doc<"places">;
  onOpen: () => void;
}) {
  const meta = categoryMeta(place.category);
  return (
    <article className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <PlaceCover
          category={place.category}
          hiddenGem={place.hiddenGem}
          className="h-36"
        />
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-snug tracking-tight group-hover:text-primary">
              {place.title}
            </h3>
            <meta.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {place.destination}
          </p>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {place.summary}
          </p>
        </div>
      </button>
      <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3">
        {place.ratingCount > 0 ? (
          <Stars
            value={place.ratingSum / place.ratingCount}
            count={place.ratingCount}
          />
        ) : (
          <span className="text-xs text-muted-foreground">No reviews yet</span>
        )}
        <span className="text-xs font-medium text-muted-foreground">
          {budgetLabel(place.budget)}
        </span>
      </div>
    </article>
  );
}
