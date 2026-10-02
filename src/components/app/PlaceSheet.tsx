import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { budgetLabel, PlaceCover, Stars } from "@/components/app/catalog";
import { ReportButton, ReviewsSection } from "@/components/app/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  CalendarDays,
  Clock,
  Lightbulb,
  Loader2,
  MapPin,
  Plus,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/** Side sheet with the full place detail, add-to-trip, reviews and reporting. */
export function PlaceSheet({
  place,
  onClose,
  onViewTrip,
}: {
  place: Doc<"places"> | null;
  onClose: () => void;
  onViewTrip: () => void;
}) {
  return (
    <Sheet
      open={place !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        className={cn(
          "w-full gap-0 overflow-y-auto p-0 sm:max-w-xl",
          "[&>button]:z-20 [&>button]:bg-background/80 [&>button]:backdrop-blur-sm",
        )}
      >
        {place && (
          <PlaceSheetContent
            key={place._id}
            place={place}
            onClose={onClose}
            onViewTrip={onViewTrip}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function PlaceSheetContent({
  place,
  onClose,
  onViewTrip,
}: {
  place: Doc<"places">;
  onClose: () => void;
  onViewTrip: () => void;
}) {
  const trips = useQuery(api.trips.listMine);
  const createTrip = useMutation(api.trips.create);
  const addItem = useMutation(api.trips.addItem);
  const { isAuthenticated } = useAuth();

  const [tripId, setTripId] = useState<Id<"itineraries"> | null>(null);
  const [day, setDay] = useState("1");
  const [forceNew, setForceNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);

  // Derived: no trips yet (or the user asked for one) shows the create form.
  const creatingNew = forceNew || trips?.length === 0;
  const selectedId: Id<"itineraries"> | null = creatingNew
    ? null
    : (tripId ?? trips?.[0]?._id ?? null);
  const selectedTrip = trips?.find((t) => t._id === selectedId) ?? null;
  const maxDay = Math.min(
    14,
    Math.max(1, ...(selectedTrip?.items.map((i) => i.day) ?? [1])),
  );
  const alreadyIn = trips?.find((t) =>
    t.items.some((i) => i.placeId === place._id),
  );
  const alreadyDay = alreadyIn?.items.find((i) => i.placeId === place._id)?.day;

  const handleAdd = async () => {
    setBusy(true);
    try {
      let targetTrip = selectedId;
      if (!targetTrip) {
        targetTrip = await createTrip({
          title: newTitle.trim() || `${place.destination} trip`,
          destination: place.destination,
        });
        setTripId(targetTrip);
        setForceNew(false);
      }
      await addItem({
        itineraryId: targetTrip,
        placeId: place._id,
        day: Number(day),
      });
      toast.success(`Added to Day ${day}`, {
        action: {
          label: "View trip",
          onClick: () => {
            onClose();
            onViewTrip();
          },
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not add this place",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-8">
      <PlaceCover
        category={place.category}
        hiddenGem={place.hiddenGem}
        image={place.image}
        alt={place.title}
        className="h-44 w-full"
        iconSize="size-32"
      />

      <div className="space-y-6 px-5 pt-5 sm:px-6">
        <div>
          <SheetHeader className="p-0 pb-0">
            <SheetTitle className="font-display text-2xl leading-tight sm:text-3xl">
              {place.title}
            </SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {place.destination}
              </span>
              {place.ratingCount > 0 ? (
                <Stars
                  value={place.ratingSum / place.ratingCount}
                  count={place.ratingCount}
                />
              ) : (
                <span className="text-xs">No reviews yet</span>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
              <Wallet className="size-3.5" />
              {budgetLabel(place.budget)}
              {typeof place.cost === "number"
                ? place.cost === 0
                  ? " · free"
                  : ` · ₹${place.cost}/person`
                : ""}
            </span>
            {place.bestTime && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                <Clock className="size-3.5" />
                {place.bestTime}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Community contributed
            </span>
          </div>
        </div>

        <p className="text-sm leading-7 text-foreground/80">
          {place.description}
        </p>

        {place.tips.length > 0 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.05] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Lightbulb className="size-4" />
              Local tips
            </p>
            <ul className="mt-3 space-y-2.5">
              {place.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex gap-2.5 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {place.contributorName && (
          <p className="text-xs text-muted-foreground">
            Contributed by{" "}
            <span className="font-medium text-foreground">
              {place.contributorName}
            </span>{" "}
            · someone who lives here
          </p>
        )}

        {/* Add to trip */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
          <p className="text-sm font-semibold">Add to your itinerary</p>
          {alreadyIn && alreadyDay ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Already in{" "}
                <span className="font-medium text-foreground">
                  {alreadyIn.title}
                </span>{" "}
                · Day {alreadyDay}
              </p>
              <Button size="sm" variant="outline" onClick={onViewTrip}>
                View trip
              </Button>
            </div>
          ) : isAuthenticated ? (
            <div className="mt-3 space-y-3">
              {creatingNew ? (
                <div className="space-y-1.5">
                  <Label htmlFor="new-trip">New trip</Label>
                  <Input
                    id="new-trip"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={`${place.destination} trip`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Destination: {place.destination}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label>Trip</Label>
                  <Select
                    value={selectedId ?? undefined}
                    onValueChange={(v) => {
                      if (v === "__new") {
                        setForceNew(true);
                      } else {
                        setTripId(v as Id<"itineraries">);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a trip" />
                    </SelectTrigger>
                    <SelectContent>
                      {trips?.map((trip) => (
                        <SelectItem key={trip._id} value={trip._id}>
                          {trip.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="__new">+ Start a new trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="day-select">Day</Label>
                  <Select value={day} onValueChange={setDay}>
                    <SelectTrigger id="day-select" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: maxDay + 1 }, (_, i) => i + 1)
                        .filter((d) => d <= 14)
                        .map((d) => (
                          <SelectItem key={d} value={String(d)}>
                            Day {d}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} disabled={busy}>
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  Add
                </Button>
              </div>
              {trips && trips.length > 0 && (
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => {
                    setForceNew(true);
                    setNewTitle("");
                  }}
                >
                  + Start a new trip instead
                </button>
              )}
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to start planning your trip.
            </p>
          )}
        </div>

        <ReviewsSection
          targetType="place"
          targetId={place._id}
          heading={`Reviews (${place.ratingCount})`}
        />

        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4">
          <ReportButton targetType="place" targetId={place._id} />
          <p className="text-right text-xs text-muted-foreground">
            Community-contributed entry
          </p>
        </div>
      </div>
    </div>
  );
}
