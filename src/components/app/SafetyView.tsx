import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Baby,
  Cross,
  Flame,
  Hospital,
  MapPin,
  Navigation,
  Phone,
  Pill,
  Siren,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ServiceKind =
  | "hospital"
  | "clinic"
  | "doctor"
  | "pharmacy"
  | "police"
  | "fire";

type NearbyService = {
  id: string;
  name: string;
  kind: ServiceKind;
  lat: number;
  lon: number;
  phone?: string;
  distance: number;
};

const EMERGENCY_NUMBERS = [
  { num: "112", labelKey: "safety.number.allInOne", icon: Siren },
  { num: "100", labelKey: "safety.number.police", icon: ShieldAlert },
  { num: "101", labelKey: "safety.number.fire", icon: Flame },
  { num: "108", labelKey: "safety.number.ambulance", icon: Cross },
  { num: "1091", labelKey: "safety.number.women", icon: ShieldCheck },
  { num: "1098", labelKey: "safety.number.child", icon: Baby },
] as const;

const SERVICE_ICONS: Record<ServiceKind, typeof Hospital> = {
  hospital: Hospital,
  clinic: Cross,
  doctor: Cross,
  pharmacy: Pill,
  police: ShieldAlert,
  fire: Flame,
};

const SERVICE_LABEL_KEYS = {
  hospital: "svc.hospital",
  clinic: "svc.clinic",
  doctor: "svc.doctor",
  pharmacy: "svc.pharmacy",
  police: "svc.police",
  fire: "svc.fire",
} as const;

function haversineKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Big tap-to-call tiles for India's national emergency numbers. */
function EmergencyGrid({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "grid gap-2.5",
        compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3",
      )}
    >
      {EMERGENCY_NUMBERS.map((item) => (
        <a
          key={item.num}
          href={`tel:${item.num}`}
          className="group flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3 transition-colors hover:border-destructive/40 hover:bg-destructive/5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <item.icon className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl leading-none tracking-tight">
              {item.num}
            </span>
            <span className="mt-1 block truncate text-[11px] text-muted-foreground">
              {t(item.labelKey)}
            </span>
          </span>
          <Phone className="ml-auto size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-destructive" />
        </a>
      ))}
    </div>
  );
}

function useShareLocation() {
  const { t } = useI18n();
  return () => {
    if (!navigator.geolocation) {
      toast.error(t("safety.locationFailed"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const text = `My live location: ${coords}\n${link}`;
        try {
          await navigator.clipboard.writeText(text);
          toast.success(t("safety.locationCopied"), { description: coords });
        } catch {
          toast.info(t("safety.locationCopied"), { description: link });
        }
      },
      () => toast.error(t("safety.locationFailed")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 },
    );
  };
}

/** The red SOS panel — numbers + live-location share. Used by tab and FAB. */
export function SosDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const shareLocation = useShareLocation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <Siren className="size-6" />
            </span>
            <div>
              <DialogTitle className="text-xl tracking-tight">
                {t("safety.sosTitle")}
              </DialogTitle>
              <DialogDescription>{t("safety.subtitle")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm leading-6 text-foreground/80">
          {t("safety.sosBody")}
        </p>

        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("safety.numbers")}
        </p>
        <EmergencyGrid compact />

        <Button className="w-full" variant="outline" onClick={shareLocation}>
          <Navigation className="size-4" />
          {t("safety.shareLocation")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/** Floating red SOS button — always one tap away anywhere in the app. */
export function SosFab() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("safety.sos")}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lifted transition-transform hover:scale-105 active:scale-95"
      >
        <Siren className="size-6" />
        <span className="absolute -top-1 -right-1 size-3 animate-ping rounded-full bg-destructive/60" />
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-destructive ring-2 ring-background" />
      </button>
      <SosDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

/** Safety tab: SOS entry, emergency numbers, and location-based nearby help. */
export function SafetyView() {
  const { t } = useI18n();
  const shareLocation = useShareLocation();
  const [sosOpen, setSosOpen] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "locating" | "searching" | "done"
  >("idle");
  const [error, setError] = useState<
    "denied" | "unavailable" | "fetch" | "empty" | null
  >(null);
  const [results, setResults] = useState<NearbyService[]>([]);

  const searchNearby = () => {
    if (!navigator.geolocation) {
      setError("unavailable");
      return;
    }
    setError(null);
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStatus("searching");
        const { latitude, longitude } = pos.coords;
        try {
          const services = await fetchNearby(latitude, longitude);
          if (services.length === 0) {
            setStatus("idle");
            setError("empty");
          } else {
            setResults(services);
            setStatus("done");
          }
        } catch {
          setStatus("idle");
          setError("fetch");
        }
      },
      (err) => {
        setStatus("idle");
        setError(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 120_000 },
    );
  };

  const busy = status === "locating" || status === "searching";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            {t("safety.title")}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            {t("safety.subtitle")}
          </p>
        </div>
        <Button
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={() => setSosOpen(true)}
        >
          <Siren className="size-4" />
          {t("safety.sos")}
        </Button>
      </div>

      {/* Emergency numbers */}
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("safety.numbers")}
          </p>
          <Button size="sm" variant="outline" onClick={shareLocation}>
            <Navigation className="size-4" />
            {t("safety.shareLocation")}
          </Button>
        </div>
        <div className="mt-4">
          <EmergencyGrid />
        </div>
      </section>

      {/* Nearby services via live location */}
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="font-semibold tracking-tight">
                {t("safety.nearby")}
              </p>
              <p className="mt-0.5 max-w-lg text-sm leading-6 text-muted-foreground">
                {t("safety.nearbyBody")}
              </p>
            </div>
          </div>
          <Button onClick={searchNearby} disabled={busy}>
            {busy ? (
              <Sparkles className="size-4 animate-pulse" />
            ) : (
              <MapPin className="size-4" />
            )}
            {status === "locating"
              ? t("safety.locating")
              : status === "searching"
                ? t("safety.searching")
                : t("safety.findNearby")}
          </Button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-border/80 bg-muted/50 p-3 text-sm text-muted-foreground">
            {error === "denied"
              ? t("safety.errDenied")
              : error === "unavailable"
                ? t("safety.errUnavailable")
                : error === "empty"
                  ? t("safety.emptyNearby")
                  : t("safety.errFetch")}
          </p>
        )}

        {status === "done" && results.length > 0 && (
          <ul className="mt-4 space-y-2">
            {results.map((svc) => {
              const Icon = SERVICE_ICONS[svc.kind];
              return (
                <li
                  key={svc.id}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{svc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(SERVICE_LABEL_KEYS[svc.kind])} ·{" "}
                      {t("safety.kmAway", {
                        n:
                          svc.distance < 10
                            ? svc.distance.toFixed(1)
                            : Math.round(svc.distance),
                      })}
                    </p>
                  </div>
                  {svc.phone && (
                    <a
                      href={`tel:${svc.phone}`}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:text-primary"
                      aria-label={t("safety.call")}
                    >
                      <Phone className="size-4" />
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${svc.lat},${svc.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:text-primary"
                    aria-label={t("safety.directions")}
                  >
                    <Navigation className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <SosDialog open={sosOpen} onOpenChange={setSosOpen} />
    </div>
  );
}

/** Query OpenStreetMap (Overpass) for help nearby — no API key required. */
async function fetchNearby(lat: number, lon: number): Promise<NearbyService[]> {
  const around = `around:5000,${lat},${lon}`;
  const query = `[out:json][timeout:25];(
    node["amenity"~"hospital|clinic|doctors|pharmacy"](${around});
    way["amenity"~"hospital|clinic|doctors|pharmacy"](${around});
    node["amenity"="police"](${around});
    way["amenity"="police"](${around});
    node["emergency"="fire_station"](${around});
    way["emergency"="fire_station"](${around});
  );out center 40;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: new URLSearchParams({ data: query }),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = (await res.json()) as {
    elements?: Array<{
      id: number;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }>;
  };

  const services: NearbyService[] = [];
  for (const el of data.elements ?? []) {
    const lat2 = el.lat ?? el.center?.lat;
    const lon2 = el.lon ?? el.center?.lon;
    const tags = el.tags ?? {};
    if (lat2 === undefined || lon2 === undefined) continue;

    let kind: ServiceKind | null = null;
    if (tags.emergency === "fire_station") kind = "fire";
    else if (tags.amenity === "hospital") kind = "hospital";
    else if (tags.amenity === "clinic") kind = "clinic";
    else if (tags.amenity === "doctors") kind = "doctor";
    else if (tags.amenity === "pharmacy") kind = "pharmacy";
    else if (tags.amenity === "police") kind = "police";
    if (!kind) continue;

    services.push({
      id: `${el.id}`,
      name: tags.name?.trim() || "",
      kind,
      lat: lat2,
      lon: lon2,
      phone: tags.phone || tags["contact:phone"] || undefined,
      distance: haversineKm(lat, lon, lat2, lon2),
    });
  }

  // Drop nameless duplicates, keep the closest of each place.
  const byKey = new Map<string, NearbyService>();
  for (const svc of services) {
    const key = `${svc.kind}:${svc.lat.toFixed(4)}:${svc.lon.toFixed(4)}`;
    const existing = byKey.get(key);
    if (!existing || svc.distance < existing.distance) byKey.set(key, svc);
  }
  return [...byKey.values()]
    .filter((s) => s.name)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 12);
}
