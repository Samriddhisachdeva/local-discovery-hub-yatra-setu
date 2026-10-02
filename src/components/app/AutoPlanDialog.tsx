import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { CATEGORIES, type CategoryValue } from "@/components/app/catalog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  CalendarDays,
  IndianRupee,
  Loader2,
  MapPin,
  Sparkles,
  Timer,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FALLBACK_COST: Record<string, number> = {
  free: 0,
  budget: 250,
  moderate: 700,
  splurge: 1500,
};

const PACES = [
  { value: "relaxed", label: "Relaxed", perDay: 2 },
  { value: "standard", label: "Standard", perDay: 3 },
  { value: "packed", label: "Packed", perDay: 4 },
] as const;

type Pace = (typeof PACES)[number]["value"];

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export function AutoPlanDialog({
  open,
  onOpenChange,
  trip,
  places,
  onGenerated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Doc<"itineraries"> | null;
  places: Doc<"places">[] | undefined;
  onGenerated: (tripId: Id<"itineraries">) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {open && (
          <AutoPlanForm
            key={trip?._id ?? "new"}
            trip={trip}
            places={places ?? []}
            onGenerated={onGenerated}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AutoPlanForm({
  trip,
  places,
  onGenerated,
  onDone,
}: {
  trip: Doc<"itineraries"> | null;
  places: Doc<"places">[];
  onGenerated: (tripId: Id<"itineraries">) => void;
  onDone: () => void;
}) {
  const autoPlan = useMutation(api.trips.autoPlan);
  const [destination, setDestination] = useState(trip?.destination ?? "");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(trip?.budget ?? 15000);
  const [pace, setPace] = useState<Pace>("standard");
  const [interests, setInterests] = useState<CategoryValue[]>([]);
  const [replace, setReplace] = useState(trip ? trip.items.length === 0 : true);
  const [busy, setBusy] = useState(false);

  const knownDestinations = [...new Set(places.map((p) => p.destination))];
  const available = places.filter(
    (p) =>
      p.destination.trim().toLowerCase() === destination.trim().toLowerCase(),
  );
  const costOf = (p: Doc<"places">) => p.cost ?? FALLBACK_COST[p.budget] ?? 0;
  const perDay = PACES.find((p) => p.value === pace)!.perDay;

  // How many local stops fit inside the budget (cheapest first).
  const affordable = [...available]
    .map(costOf)
    .sort((a, b) => a - b)
    .reduce<{ count: number; sum: number }>(
      (acc, c) =>
        acc.sum + c <= budget
          ? { count: acc.count + 1, sum: acc.sum + c }
          : acc,
      { count: 0, sum: 0 },
    );
  const estStops = Math.min(days * perDay, affordable.count);

  const toggleInterest = (value: CategoryValue) =>
    setInterests((current) =>
      current.includes(value)
        ? current.filter((c) => c !== value)
        : [...current, value],
    );

  const submit = async () => {
    if (!destination.trim()) {
      toast.error("Pick a destination first.");
      return;
    }
    if (available.length === 0) {
      toast.error(
        `No local places in “${destination}” yet — try ${knownDestinations.slice(0, 3).join(", ") || "a listed destination"}.`,
      );
      return;
    }
    setBusy(true);
    try {
      const result = await autoPlan({
        itineraryId: trip?._id,
        destination: destination.trim(),
        days,
        budget,
        pace,
        interests,
        replace,
      });
      onGenerated(result.itineraryId);
      toast.success(
        `Plan ready — ${result.stops} stop${result.stops === 1 ? "" : "s"} · ₹${inr(result.spend)} planned`,
        { description: "Drag-free, day-wise and inside your budget." },
      );
      onDone();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not build the plan",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="size-5 text-primary" />
          Auto-plan my itinerary
        </DialogTitle>
        <DialogDescription>
          Tell us the duration and budget — we&apos;ll rank local places and
          fill each day for you.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {/* Destination */}
        <div className="space-y-1.5">
          <Label htmlFor="plan-destination">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="plan-destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Varanasi"
              className="pl-9"
              list="plan-destinations"
            />
            <datalist id="plan-destinations">
              {knownDestinations.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          {destination.trim() && (
            <p className="text-xs text-muted-foreground">
              {available.length > 0
                ? `${available.length} local places · cheapest ₹${inr(Math.min(...available.map(costOf)))} · from ₹${inr(affordable.sum)} to fill ${estStops} stop${estStops === 1 ? "" : "s"}`
                : "No places here yet — pick another destination."}
            </p>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              Trip duration
            </Label>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {days} day{days === 1 ? "" : "s"}
            </span>
          </div>
          <Slider
            value={[days]}
            onValueChange={([v]) => setDays(v)}
            min={1}
            max={10}
            step={1}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>1 day</span>
            <span>10 days</span>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <IndianRupee className="size-4 text-muted-foreground" />
              Total budget per person
            </Label>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
              ₹{inr(budget)}
            </span>
          </div>
          <Slider
            value={[budget]}
            onValueChange={([v]) => setBudget(v)}
            min={2000}
            max={60000}
            step={1000}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>₹2,000</span>
            <span>₹60,000</span>
          </div>
        </div>

        {/* Pace */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Timer className="size-4 text-muted-foreground" />
            Pace
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {PACES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPace(p.value)}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-center transition-colors",
                  pace === p.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="block text-sm font-semibold">{p.label}</span>
                <span className="block text-[11px] opacity-80">
                  {p.perDay} stops / day
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <Label>Interests (optional)</Label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = interests.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleInterest(cat.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <cat.icon className="size-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {interests.length === 0
              ? "No preference — we'll mix everything."
              : `Prioritising ${interests.length} categor${interests.length === 1 ? "y" : "ies"}.`}
          </p>
        </div>

        {/* Summary + replace */}
        <div className="rounded-xl border border-primary/25 bg-primary/[0.05] p-3.5 text-sm">
          <p className="font-medium">
            ≈ {estStops} stop{estStops === 1 ? "" : "s"} over {days} day
            {days === 1 ? "" : "s"}, up to ₹{inr(affordable.sum)} of your budget
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ranked by ratings, hidden gems, your interests and cost.
          </p>
          {trip && trip.items.length > 0 && (
            <label className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-background/70 px-3 py-2">
              <span className="text-xs font-medium">
                Replace my {trip.items.length} existing stop
                {trip.items.length === 1 ? "" : "s"}
              </span>
              <Switch checked={replace} onCheckedChange={setReplace} />
            </label>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={busy}>
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          Generate itinerary
        </Button>
      </DialogFooter>
    </>
  );
}
