import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  budgetLabel,
  CATEGORIES,
  Stars,
  VerifiedBadge,
} from "@/components/app/catalog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  BadgeCheck,
  HeartHandshake,
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  Siren,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

const LANGUAGE_OPTIONS = [
  "Hindi",
  "English",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Punjabi",
  "Odia",
  "Assamese",
  "Bhojpuri",
  "Khasi",
  "Kutchi",
];

const EMERGENCY = [
  {
    code: "112",
    label: "All-in-one emergency",
    note: "Police · Fire · Ambulance",
  },
  { code: "1091", label: "Women helpline", note: "Nationwide" },
  { code: "1098", label: "Childline", note: "Children in distress" },
  { code: "1363", label: "Tourist helpline", note: "Ministry of Tourism" },
  { code: "108", label: "Ambulance", note: "Varies by state" },
  { code: "100", label: "Police", note: "Non-emergency line" },
];

const SAFETY_TIPS = [
  "Add your day plan to a trip so someone at home can see where you're headed.",
  "Look for the verified badge before meeting any guide, and agree on the plan in writing.",
  "Meet in a public place first — a ghat, a market, a café — before anything remote.",
  "Carry your own ID; keep digital copies in your notes app.",
  "If something feels off, report the profile or place from its detail page — reports are private.",
];

export function ContributeView() {
  const { user } = useAuth();
  const myPlaces = useQuery(api.places.mine);
  const myGuide = useQuery(api.guides.mine);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Contribute as a local
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Your knowledge is what makes Yatra Setu work — share places, food,
            routes and culture, then apply to guide travellers yourself.
          </p>
        </div>
        <p className="rounded-full border border-border bg-card px-3.5 py-2 text-xs text-muted-foreground">
          Signed in as{" "}
          <span className="font-medium text-foreground">
            {user?.name || user?.email || "local"}
          </span>
        </p>
      </div>

      <Tabs defaultValue="place" className="gap-6">
        <TabsList className="h-10">
          <TabsTrigger value="place" className="gap-2">
            <Plus className="size-4" />
            Add a place
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <UserRound className="size-4" />
            Guide profile
          </TabsTrigger>
          <TabsTrigger value="safety" className="gap-2">
            <ShieldCheck className="size-4" />
            Safety
          </TabsTrigger>
        </TabsList>

        {/* ── Place contribution ─────────────────────────────── */}
        <TabsContent value="place" className="space-y-6">
          <PlaceForm />
          <MyContributions places={myPlaces ?? null} />
        </TabsContent>

        {/* ── Guide profile ──────────────────────────────────── */}
        <TabsContent value="guide" className="space-y-6">
          <GuideProfile
            key={myGuide?._id ?? "new"}
            guide={myGuide ?? null}
            loading={myGuide === undefined}
          />
        </TabsContent>

        {/* ── Safety ─────────────────────────────────────────── */}
        <TabsContent value="safety" className="space-y-6">
          <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Siren className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold tracking-tight">
                  Emergency contacts
                </h2>
                <p className="text-sm text-muted-foreground">
                  Keep these handy anywhere you travel in India.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EMERGENCY.map((item) => (
                <div
                  key={item.code}
                  className="flex items-baseline gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5"
                >
                  <span className="font-display text-2xl leading-none text-primary">
                    {item.code}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Numbers are indicative — confirm locally and save them before you
              set out.
            </p>
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold tracking-tight">
                  Staying safe on the road
                </h2>
                <p className="text-sm text-muted-foreground">
                  Simple habits that keep trips relaxed for everyone.
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {SAFETY_TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#c9a227]/40 bg-[#faf6e7] p-4 dark:bg-[#2a2619]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#8a6d1f] dark:text-[#e0c96a]" />
              <p className="text-sm leading-6 text-[#6b5c41] dark:text-[#d8c98f]">
                Yatra Setu supports verification, reviews and reporting, but
                always use your own judgement and follow local laws.
              </p>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ───────────────────────── add a place form ───────────────────────── */

function PlaceForm() {
  const places = useQuery(api.places.list);
  const createPlace = useMutation(api.places.create);
  const [category, setCategory] = useState<string>("food");
  const [budget, setBudget] = useState<string>("budget");
  const [hiddenGem, setHiddenGem] = useState(false);
  const [busy, setBusy] = useState(false);

  const destinations = [...new Set((places ?? []).map((p) => p.destination))];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    try {
      await createPlace({
        title: String(data.get("title") ?? ""),
        destination: String(data.get("destination") ?? ""),
        category: category as (typeof CATEGORIES)[number]["value"],
        summary: String(data.get("summary") ?? ""),
        description: String(data.get("description") ?? ""),
        tips: String(data.get("tips") ?? "")
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean),
        budget: budget as "free" | "budget" | "moderate" | "splurge",
        bestTime: String(data.get("bestTime") ?? ""),
        hiddenGem,
      });
      form.reset();
      setHiddenGem(false);
      toast.success("Place published", {
        description: "Travellers can now discover your recommendation.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not publish this place",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Plus className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold tracking-tight">
            Share a place or experience
          </h2>
          <p className="text-sm text-muted-foreground">
            The lane, stall, viewpoint or festival that outsiders miss.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="place-title">Place name</Label>
          <Input
            id="place-title"
            name="title"
            required
            minLength={3}
            placeholder="e.g. Kabir Chaura lanes"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="place-destination">Destination</Label>
          <Input
            id="place-destination"
            name="destination"
            required
            list="known-destinations"
            placeholder="e.g. Varanasi"
          />
          <datalist id="known-destinations">
            {destinations.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Budget</Label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["free", "budget", "moderate", "splurge"].map((b) => (
                <SelectItem key={b} value={b}>
                  {budgetLabel(b)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="place-summary">One-line summary</Label>
          <Input
            id="place-summary"
            name="summary"
            required
            minLength={10}
            placeholder="Why should a traveller care?"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="place-description">Description</Label>
          <Textarea
            id="place-description"
            name="description"
            required
            rows={4}
            className="resize-none"
            placeholder="What is this place, what happens here, and when is it at its best?"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="place-tips">Local tips (one per line)</Label>
          <Textarea
            id="place-tips"
            name="tips"
            rows={3}
            className="resize-none"
            placeholder={"Best before 8 AM\nCash only at the second stall\n..."}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="place-besttime">Best time to visit</Label>
          <Input
            id="place-besttime"
            name="bestTime"
            placeholder="e.g. Oct–Feb, sunrise"
          />
        </div>
        <label className="flex items-center justify-between gap-3 self-end rounded-xl border border-border/70 bg-muted/40 px-4 py-2.5">
          <span className="text-sm font-medium">Hidden gem</span>
          <Switch checked={hiddenGem} onCheckedChange={setHiddenGem} />
        </label>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Publish to Yatra Setu
          </Button>
        </div>
      </form>
    </section>
  );
}

function MyContributions({ places }: { places: Doc<"places">[] | null }) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold tracking-tight">My contributions</h2>
          <p className="text-sm text-muted-foreground">
            Places you've shared with travellers.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {places ? places.length : 0}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {places === null ? (
          <Skeleton className="h-16 w-full" />
        ) : places.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            Nothing yet — your first recommendation could be the one a traveller
            remembers most.
          </p>
        ) : (
          places.map((place) => (
            <div
              key={place._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{place.title}</p>
                <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {place.destination}
                  </span>
                  <span>·</span>
                  <span>
                    {place.hiddenGem ? "Hidden gem" : "Community place"}
                  </span>
                </p>
              </div>
              {place.ratingCount > 0 ? (
                <Stars
                  value={place.ratingSum / place.ratingCount}
                  count={place.ratingCount}
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  No reviews yet
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── guide profile ───────────────────────── */

function GuideProfile({
  guide,
  loading,
}: {
  guide: Doc<"guides"> | null;
  loading: boolean;
}) {
  const apply = useMutation(api.guides.apply);
  const confirmIdentity = useMutation(api.guides.confirmIdentity);
  const places = useQuery(api.places.list);

  const [name, setName] = useState(guide?.name ?? "");
  const [destination, setDestination] = useState(guide?.destination ?? "");
  const [headline, setHeadline] = useState(guide?.headline ?? "");
  const [bio, setBio] = useState(guide?.bio ?? "");
  const [contact, setContact] = useState(guide?.contact ?? "");
  const [years, setYears] = useState(String(guide?.years ?? 1));
  const [expertise, setExpertise] = useState(guide?.expertise.join(", ") ?? "");
  const [languages, setLanguages] = useState<string[]>(
    guide?.languages ?? ["English"],
  );
  const [busy, setBusy] = useState(false);

  const destinations = [...new Set((places ?? []).map((p) => p.destination))];

  const toggleLanguage = (lang: string) =>
    setLanguages((current) =>
      current.includes(lang)
        ? current.filter((l) => l !== lang)
        : [...current, lang],
    );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      await apply({
        name,
        destination,
        headline,
        bio,
        languages,
        expertise: expertise
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        years: Number(years) || 0,
        contact,
      });
      toast.success(guide ? "Profile updated" : "Application submitted", {
        description: guide
          ? "Your guide profile is live with the latest details."
          : "Confirm your identity to go live to travellers.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save profile",
      );
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!guide) return;
    setBusy(true);
    try {
      await confirmIdentity({ guideId: guide._id });
      toast.success("You're verified", {
        description: "Your profile is now visible to travellers.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not verify profile",
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-border/80 bg-card p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-40 w-full" />
      </section>
    );
  }

  return (
    <>
      {guide && guide.status !== "active" && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#c9a227]/40 bg-[#faf6e7] p-5 dark:bg-[#2a2619]">
          <div className="flex items-center gap-3">
            <VerifiedBadge pending />
            <p className="text-sm text-[#6b5c41] dark:text-[#d8c98f]">
              Your profile stays hidden from travellers until you confirm your
              details.
            </p>
          </div>
          <Button size="sm" onClick={confirm} disabled={busy}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <BadgeCheck className="size-4" />
            )}
            Confirm identity & go live
          </Button>
        </div>
      )}
      {guide && guide.status === "active" && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/[0.05] p-5">
          <div className="flex items-center gap-3">
            <VerifiedBadge />
            <p className="text-sm text-muted-foreground">
              Visible to travellers in {guide.destination} · {guide.ratingCount}{" "}
              review
              {guide.ratingCount === 1 ? "" : "s"} so far.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={confirm}
            disabled={busy || guide.verified}
          >
            {guide.verified ? "Identity confirmed" : "Re-confirm identity"}
          </Button>
        </div>
      )}

      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HeartHandshake className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight">
              {guide ? "Your guide profile" : "Become a local guide"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {guide
                ? "Update your details — travellers see them right away."
                : "Turn what you know into a service travellers can book directly."}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="guide-name">Display name</Label>
            <Input
              id="guide-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="guide-destination">Based in</Label>
            <Input
              id="guide-destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              list="guide-destinations"
              placeholder="e.g. Varanasi"
            />
            <datalist id="guide-destinations">
              {destinations.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="guide-headline">Headline</Label>
            <Input
              id="guide-headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              placeholder="Boatman and ghat storyteller"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="guide-bio">About you</Label>
            <Textarea
              id="guide-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              minLength={30}
              rows={4}
              className="resize-none"
              placeholder="What do you show travellers, and what makes your corner of the city special?"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Languages</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {LANGUAGE_OPTIONS.map((lang) => {
                const active = languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={
                      active
                        ? "rounded-full border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    }
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guide-expertise">Expertise (comma separated)</Label>
            <Input
              id="guide-expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="Ghats & lanes, sunrise boats"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="guide-years">Years of experience</Label>
            <Input
              id="guide-years"
              type="number"
              min={0}
              max={80}
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="guide-contact">Contact</Label>
            <Input
              id="guide-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              placeholder="Phone or email travellers can reach you on"
            />
            <p className="text-xs text-muted-foreground">
              Shared only with signed-in travellers who open your profile.
            </p>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : guide ? (
                <BadgeCheck className="size-4" />
              ) : (
                <UserRound className="size-4" />
              )}
              {guide ? "Save profile" : "Apply to become a guide"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
