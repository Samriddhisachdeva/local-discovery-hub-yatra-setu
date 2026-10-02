import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { categoryMeta } from "@/components/app/catalog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  ChevronDown,
  ChevronUp,
  Compass,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

export function TripsView({ onBrowse }: { onBrowse: () => void }) {
  const trips = useQuery(api.trips.listMine);
  const createTrip = useMutation(api.trips.create);
  const updateTrip = useMutation(api.trips.update);
  const removeTrip = useMutation(api.trips.remove);
  const removeItem = useMutation(api.trips.removeItem);
  const moveItem = useMutation(api.trips.moveItem);

  const [activeId, setActiveId] = useState<Id<"itineraries"> | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [busy, setBusy] = useState(false);

  const active = useMemo(
    () => trips?.find((t) => t._id === activeId) ?? trips?.[0] ?? null,
    [trips, activeId],
  );

  const days = useMemo(() => {
    if (!active)
      return [] as { day: number; items: Doc<"itineraries">["items"] }[];
    const maxDay = active.items.reduce((max, i) => Math.max(max, i.day), 0);
    return Array.from({ length: maxDay }, (_, i) => ({
      day: i + 1,
      items: active.items.filter((item) => item.day === i + 1),
    }));
  }, [active]);

  const openNew = () => {
    setTitle("");
    setDestination("");
    setNewOpen(true);
  };

  const handleCreate = async () => {
    setBusy(true);
    try {
      const id = await createTrip({ title, destination });
      setActiveId(id);
      setNewOpen(false);
      toast.success("Trip created", {
        description: "Start adding places from Discover.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create trip",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRename = async () => {
    if (!active) return;
    setBusy(true);
    try {
      await updateTrip({ itineraryId: active._id, title, destination });
      setRenameOpen(false);
      toast.success("Trip updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update trip",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!active) return;
    setBusy(true);
    try {
      await removeTrip({ itineraryId: active._id });
      setActiveId(null);
      setDeleteOpen(false);
      toast.success("Trip deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete trip",
      );
    } finally {
      setBusy(false);
    }
  };

  const act = async (
    placeId: Id<"places">,
    action: "up" | "down" | "earlierDay" | "laterDay",
  ) => {
    if (!active) return;
    try {
      await moveItem({ itineraryId: active._id, placeId, action });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not move stop",
      );
    }
  };

  const drop = async (placeId: Id<"places">) => {
    if (!active) return;
    try {
      await removeItem({ itineraryId: active._id, placeId });
      toast.success("Stop removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not remove stop",
      );
    }
  };

  if (!trips) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="space-y-6">
        <TripsHeader onNew={openNew} />
        <Empty>
          <EmptyHeader>
            <EmptyContent>
              <EmptyTitle>No trips yet</EmptyTitle>
              <EmptyDescription>
                Create a trip, then add places from Discover to start building a
                day-wise plan.
              </EmptyDescription>
            </EmptyContent>
          </EmptyHeader>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={openNew}>
              <Plus className="size-4" />
              New trip
            </Button>
            <Button variant="outline" onClick={onBrowse}>
              <Compass className="size-4" />
              Browse places
            </Button>
          </div>
        </Empty>
        <TripDialog
          open={newOpen}
          onOpenChange={setNewOpen}
          title={title}
          setTitle={setTitle}
          destination={destination}
          setDestination={setDestination}
          onSubmit={handleCreate}
          busy={busy}
          submitLabel="Create trip"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TripsHeader onNew={openNew} />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Trip switcher */}
        <aside className="flex flex-col gap-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Your trips
          </p>
          {trips.map((trip) => (
            <button
              key={trip._id}
              type="button"
              onClick={() => setActiveId(trip._id)}
              className={cn(
                "rounded-xl border px-3.5 py-3 text-left transition-colors",
                active?._id === trip._id
                  ? "border-primary/40 bg-primary/[0.06] shadow-soft"
                  : "border-border/80 bg-card hover:bg-muted/60",
              )}
            >
              <p className="truncate text-sm font-semibold">{trip.title}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {trip.destination} · {trip.items.length} stops
              </p>
            </button>
          ))}
        </aside>

        {/* Active trip */}
        {active && (
          <section className="min-w-0 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
              <div>
                <h2 className="font-display text-2xl leading-tight">
                  {active.title}
                </h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {active.destination}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarRange className="size-3.5" />
                    {active.items.length} stops · {Math.max(days.length, 1)} day
                    {days.length === 1 ? "" : "s"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTitle(active.title);
                    setDestination(active.destination);
                    setRenameOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            {active.items.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="font-medium">This trip is still empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add places from Discover and drop them into days.
                </p>
                <Button className="mt-4" onClick={onBrowse}>
                  <Compass className="size-4" />
                  Browse places
                </Button>
              </div>
            )}

            {days.map(({ day, items }) => {
              return (
                <div
                  key={day}
                  className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                        {day}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Day {day}</p>
                        <p className="text-xs text-muted-foreground">
                          {items.length === 0
                            ? "Nothing planned yet"
                            : `${items.length} stop${items.length === 1 ? "" : "s"}`}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onBrowse}>
                      <Plus className="size-4" />
                      Add stops
                    </Button>
                  </div>

                  {items.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {items.map((item, index) => {
                        const meta = categoryMeta(item.category);
                        return (
                          <li
                            key={item.placeId}
                            className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-2.5"
                          >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                              <meta.icon className="size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {item.title}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {item.destination} · {meta.label}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <IconBtn
                                label="Move up"
                                disabled={index === 0}
                                onClick={() => act(item.placeId, "up")}
                              >
                                <ChevronUp className="size-4" />
                              </IconBtn>
                              <IconBtn
                                label="Move down"
                                disabled={index === items.length - 1}
                                onClick={() => act(item.placeId, "down")}
                              >
                                <ChevronDown className="size-4" />
                              </IconBtn>
                              <IconBtn
                                label="Move to previous day"
                                disabled={day === 1}
                                onClick={() => act(item.placeId, "earlierDay")}
                              >
                                <ArrowLeft className="size-4" />
                              </IconBtn>
                              <IconBtn
                                label="Move to next day"
                                disabled={day >= 14}
                                onClick={() => act(item.placeId, "laterDay")}
                              >
                                <ArrowRight className="size-4" />
                              </IconBtn>
                              <IconBtn
                                label="Remove stop"
                                onClick={() => drop(item.placeId)}
                              >
                                <X className="size-4" />
                              </IconBtn>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                      Open Discover and add a place straight to Day {day}.
                    </p>
                  )}
                </div>
              );
            })}

            {active.items.length > 0 && days.length < 14 && (
              <p className="text-center text-xs text-muted-foreground">
                Add a place to “Day {days.length + 1}” from its detail panel to
                extend the plan.
              </p>
            )}
          </section>
        )}
      </div>

      <TripDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        title={title}
        setTitle={setTitle}
        destination={destination}
        setDestination={setDestination}
        onSubmit={handleCreate}
        busy={busy}
        submitLabel="Create trip"
      />
      <TripDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title={title}
        setTitle={setTitle}
        destination={destination}
        setDestination={setDestination}
        onSubmit={handleRename}
        busy={busy}
        submitLabel="Save changes"
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              “{active?.title}” and its day plan will be removed. The places
              themselves stay on Yatra Setu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={busy}>
              Delete trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TripsHeader({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          My trips
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          A day-wise plan built from the places you saved.
        </p>
      </div>
      <Button onClick={onNew}>
        <Plus className="size-4" />
        New trip
      </Button>
    </div>
  );
}

function IconBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
      )}
    >
      {children}
    </button>
  );
}

function TripDialog({
  open,
  onOpenChange,
  title,
  setTitle,
  destination,
  setDestination,
  onSubmit,
  busy,
  submitLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  destination: string;
  setDestination: (v: string) => void;
  onSubmit: () => void;
  busy: boolean;
  submitLabel: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {submitLabel === "Create trip" ? "Plan a new trip" : "Edit trip"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trip-title">Trip name</Label>
            <Input
              id="trip-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Varanasi in three days"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-destination">Destination</Label>
            <Input
              id="trip-destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Varanasi"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={busy || !destination.trim()}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
