import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { AvatarChip, Stars, VerifiedBadge } from "@/components/app/catalog";
import { ReviewsSection } from "@/components/app/feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  Clock,
  Copy,
  Languages,
  MapPin,
  Search,
  SearchX,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

export function GuidesView({
  onGoToContribute,
}: {
  onGoToContribute: () => void;
}) {
  const { t } = useI18n();
  const guides = useQuery(api.guides.list);
  const myGuide = useQuery(api.guides.mine);
  const myRequests = useQuery(api.requests.mine);
  const cancelRequest = useMutation(api.requests.cancel);
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("all");
  const [openId, setOpenId] = useState<Id<"guides"> | null>(null);

  const destinations = useMemo(() => {
    if (!guides) return [];
    return [...new Set(guides.map((g) => g.destination))].sort();
  }, [guides]);

  const filtered = useMemo(() => {
    if (!guides) return [];
    const term = search.trim().toLowerCase();
    return guides.filter((guide) => {
      if (destination !== "all" && guide.destination !== destination)
        return false;
      if (!term) return true;
      return [
        guide.name,
        guide.headline,
        guide.destination,
        guide.bio,
        ...guide.languages,
        ...guide.expertise,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [guides, search, destination]);

  const openGuide =
    (openId ? guides?.find((g) => g._id === openId) : undefined) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            {t("guides.title")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("guides.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("guides.search")}
              className="pl-9 sm:w-64"
            />
          </div>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("guides.allDest")}</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Become a guide CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/[0.05] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <UserRound className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {myGuide
                ? myGuide.status === "active"
                  ? "Your guide profile is live"
                  : "Your guide profile is awaiting verification"
                : "Know your home better than anyone?"}
            </p>
            <p className="text-xs text-muted-foreground">
              {myGuide
                ? "Keep it fresh — update your expertise and languages any time."
                : "Apply to become a verified local guide and connect with travellers."}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onGoToContribute}>
          {myGuide ? t("guides.openProfile") : t("guides.become")}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {!guides ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/70 p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="mt-4 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <p className="mt-4 font-medium">No guides match that search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another destination, or browse all guides.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              setSearch("");
              setDestination("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <GuideCard
              key={guide._id}
              guide={guide}
              isMine={myGuide?._id === guide._id}
              onOpen={() => setOpenId(guide._id)}
            />
          ))}
        </div>
      )}

      <GuideDialog guide={openGuide} onClose={() => setOpenId(null)} />

      {/* Traveller's own requests to guides */}
      {myRequests !== undefined && (
        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("req.myRequests")}
          </p>
          {myRequests.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {t("req.none")}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {myRequests.map((req) => (
                <li
                  key={req._id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-3"
                >
                  <AvatarChip name={req.guideName} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {req.guideName}
                      <span className="ml-2 font-normal text-muted-foreground">
                        {req.destination}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("req.details", {
                        date:
                          req.date === "flexible"
                            ? t("req.flexibleLabel")
                            : req.date,
                        days: req.days,
                        party: req.partySize,
                      })}
                    </p>
                  </div>
                  <StatusChip status={req.status} />
                  {req.status === "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        cancelRequest({ requestId: req._id }).catch(
                          (err: unknown) =>
                            toast.error(
                              err instanceof Error
                                ? err.message
                                : "Could not cancel the request.",
                            ),
                        );
                      }}
                    >
                      {t("req.cancel")}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

function StatusChip({
  status,
}: {
  status: "pending" | "accepted" | "denied" | "cancelled";
}) {
  const { t } = useI18n();
  const styles = {
    pending:
      "border-amber-300/60 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
    accepted:
      "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
    denied: "border-destructive/40 bg-destructive/10 text-destructive",
    cancelled: "border-border bg-muted text-muted-foreground",
  } as const;
  const label = {
    pending: t("req.status.pending"),
    accepted: t("req.status.accepted"),
    denied: t("req.status.denied"),
    cancelled: t("req.status.cancelled"),
  }[status];
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      {label}
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function GuideCard({
  guide,
  isMine,
  onOpen,
}: {
  guide: Doc<"guides">;
  isMine: boolean;
  onOpen: () => void;
}) {
  const { t } = useI18n();
  const rating = guide.ratingCount ? guide.ratingSum / guide.ratingCount : 0;
  return (
    <article className="flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted">
      <div className="flex items-start gap-3">
        <AvatarChip name={guide.name} className="size-11" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold tracking-tight">
              {guide.name}
            </h3>
            {isMine && (
              <span className="text-[11px] font-medium text-muted-foreground">
                (you)
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {guide.destination} · {guide.years} yrs experience
          </p>
        </div>
      </div>

      <div className="mt-3">
        <VerifiedBadge pending={!guide.verified} />
      </div>

      <p className="mt-3 text-sm font-medium">{guide.headline}</p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {guide.bio}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {guide.languages.slice(0, 3).map((lang) => (
          <Chip key={lang}>{lang}</Chip>
        ))}
        {guide.expertise.slice(0, 2).map((skill) => (
          <Chip key={skill}>{skill}</Chip>
        ))}
        {guide.languages.length > 3 && (
          <Chip>+{guide.languages.length - 3} langs</Chip>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
        {guide.ratingCount > 0 ? (
          <Stars value={rating} count={guide.ratingCount} />
        ) : (
          <span className="text-xs text-muted-foreground">No reviews yet</span>
        )}
        <Button size="sm" onClick={onOpen}>
          {t("guides.connect")}
        </Button>
      </div>
    </article>
  );
}

function GuideDialog({
  guide,
  onClose,
}: {
  guide: Doc<"guides"> | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={guide !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
        {guide && <GuideDialogContent key={guide._id} guide={guide} />}
      </DialogContent>
    </Dialog>
  );
}

function GuideDialogContent({ guide }: { guide: Doc<"guides"> }) {
  const { t } = useI18n();
  const myRequests = useQuery(api.requests.mine);
  const createRequest = useMutation(api.requests.create);
  const [mode, setMode] = useState<"info" | "form">("info");
  const [sending, setSending] = useState(false);

  const rating = guide.ratingCount ? guide.ratingSum / guide.ratingCount : 0;
  const pending = myRequests?.find(
    (r) => r.guideId === guide._id && r.status === "pending",
  );

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    try {
      await createRequest({
        guideId: guide._id,
        date: (form.get("date") as string | null) || "flexible",
        days: Number(form.get("days")) || 1,
        partySize: Number(form.get("party")) || 1,
        message: String(form.get("message") ?? ""),
        contact:
          ((form.get("contact") as string | null) ?? "").trim() || undefined,
      });
      toast.success(t("req.sent"));
      setMode("info");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send the request.",
      );
    } finally {
      setSending(false);
    }
  };

  const copyContact = async () => {
    try {
      await navigator.clipboard.writeText(guide.contact);
      toast.success("Contact copied", { description: guide.contact });
    } catch {
      toast.info("Reach them at", { description: guide.contact });
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-start gap-4">
          <AvatarChip name={guide.name} className="size-14 text-base" />
          <div className="min-w-0">
            <DialogTitle className="text-xl tracking-tight">
              {guide.name}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {guide.destination}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                {guide.years} years guiding
              </span>
              {guide.ratingCount > 0 && (
                <Stars value={rating} count={guide.ratingCount} />
              )}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="mt-1 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <VerifiedBadge pending={!guide.verified} />
          <span className="text-sm font-medium">{guide.headline}</span>
        </div>

        <p className="text-sm leading-7 text-foreground/80">{guide.bio}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Languages className="size-4" />
              Languages
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {guide.languages.map((lang) => (
                <Chip key={lang}>{lang}</Chip>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="size-4" />
              Expertise
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {guide.expertise.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Connect directly
          </p>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
            <code className="rounded-lg bg-background px-3 py-2 text-sm">
              {guide.contact}
            </code>
            <Button size="sm" variant="outline" onClick={copyContact}>
              <Copy className="size-4" />
              Copy contact
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Keep first contact on Yatra Setu and agree on details before paying
            anyone.
          </p>
        </div>

        {/* Request this specific guide */}
        {pending ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10">
            <p className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
              <Clock className="size-4" />
              {t("req.sent")}
            </p>
            <StatusChip status={pending.status} />
          </div>
        ) : mode === "info" ? (
          <Button className="w-full" onClick={() => setMode("form")}>
            <Send className="size-4" />
            {t("req.heading", { name: guide.name })}
          </Button>
        ) : (
          <form
            onSubmit={submitRequest}
            className="space-y-4 rounded-xl border border-border/80 bg-muted/30 p-4"
          >
            <div>
              <p className="text-sm font-semibold tracking-tight">
                {t("req.heading", { name: guide.name })}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {t("req.blurb")}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block text-xs font-medium text-muted-foreground">
                {t("req.date")}
                <Input
                  name="date"
                  type="date"
                  className="mt-1.5 bg-background"
                />
                <span className="mt-1 block font-normal">
                  {t("req.flexible")}
                </span>
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                {t("req.days")}
                <Input
                  name="days"
                  type="number"
                  min={1}
                  max={30}
                  defaultValue={2}
                  className="mt-1.5 bg-background"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                {t("req.party")}
                <Input
                  name="party"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={2}
                  className="mt-1.5 bg-background"
                />
              </label>
            </div>

            <label className="block text-xs font-medium text-muted-foreground">
              {t("req.message")}
              <Textarea
                name="message"
                required
                minLength={15}
                rows={3}
                placeholder={t("req.messagePh")}
                className="mt-1.5 bg-background"
              />
            </label>

            <label className="block text-xs font-medium text-muted-foreground">
              {t("req.contact")}
              <Input
                name="contact"
                placeholder="+91 …"
                className="mt-1.5 bg-background"
              />
            </label>

            <div className="flex gap-2">
              <Button type="submit" disabled={sending} className="flex-1">
                {sending ? (
                  <Sparkles className="size-4 animate-pulse" />
                ) : (
                  <Send className="size-4" />
                )}
                {sending ? t("req.sending") : t("req.send")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("info")}
                disabled={sending}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        )}

        <ReviewsSection
          targetType="guide"
          targetId={guide._id}
          heading={`Reviews (${guide.ratingCount})`}
        />
      </div>
    </>
  );
}
