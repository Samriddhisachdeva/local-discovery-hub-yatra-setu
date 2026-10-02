import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Brand } from "@/components/Brand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AvatarChip, VerifiedBadge } from "@/components/app/catalog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/i18n";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  Check,
  History,
  Inbox,
  MapPin,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const createdLabel = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function GuidePortal() {
  const { t } = useI18n();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const myGuide = useQuery(api.guides.mine);
  const incoming = useQuery(api.requests.forGuide);
  const resolved = useQuery(api.requests.forGuideResolved);
  const respond = useMutation(api.requests.respond);

  const [respondingTo, setRespondingTo] = useState<Id<"guideRequests"> | null>(
    null,
  );
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const acceptedCount =
    resolved?.filter((r) => r.status === "accepted").length ?? 0;
  const deniedCount =
    resolved?.filter((r) => r.status === "denied").length ?? 0;

  const decide = async (decision: "accepted" | "denied") => {
    if (!respondingTo) return;
    setBusy(true);
    try {
      await respond({
        requestId: respondingTo,
        decision,
        note: note.trim() || undefined,
      });
      toast.success(
        decision === "accepted" ? t("portal.accepted") : t("portal.denied"),
      );
      setRespondingTo(null);
      setNote("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not respond to the request.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-4 px-5 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <Brand />
          </button>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              {t("portal.backApp")}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              {t("menu.signOut")}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 md:py-10">
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            {t("portal.title")}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            {t("portal.subtitle")}
          </p>
        </div>

        {myGuide === undefined ||
        incoming === undefined ||
        resolved === undefined ? (
          <div className="mt-8 space-y-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : myGuide === null ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="size-6" />
            </span>
            <p className="mt-4 font-display text-2xl tracking-tight">
              {t("portal.noProfile")}
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {t("portal.noProfileBody")}
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate("/dashboard?tab=contribute")}
            >
              {t("portal.applyCta")}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Profile card */}
            <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
              <AvatarChip name={myGuide.name} className="size-12 text-sm" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold tracking-tight">{myGuide.name}</p>
                  <VerifiedBadge pending={!myGuide.verified} />
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {myGuide.destination} · {myGuide.headline}
                </p>
              </div>
              <div className="flex gap-2 text-center">
                <Stat
                  label={t("portal.statPending")}
                  value={incoming.length}
                  highlight
                />
                <Stat label={t("portal.statAccepted")} value={acceptedCount} />
                <Stat label={t("portal.statDenied")} value={deniedCount} />
              </div>
            </section>

            {myGuide.status === "pending" && (
              <p className="flex items-center gap-2 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
                <ShieldAlert className="size-4 shrink-0" />
                {t("portal.verifyNotice")}
              </p>
            )}

            {/* Inbox */}
            <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Inbox className="size-4" />
                {t("portal.inbox")}
              </p>

              {incoming.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="font-medium">{t("portal.empty")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("portal.emptyBody")}
                  </p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {incoming.map((req) => (
                    <li
                      key={req._id}
                      className="rounded-xl border border-border/70 bg-muted/30 p-4"
                    >
                      <div className="flex flex-wrap items-start gap-3">
                        <AvatarChip
                          name={req.travelerName}
                          className="size-10 text-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="font-medium">{req.travelerName}</p>
                            <span className="text-xs text-muted-foreground">
                              {createdLabel(req.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {t("req.details", {
                              date:
                                req.date === "flexible"
                                  ? t("req.flexibleLabel")
                                  : req.date,
                              days: req.days,
                              party: req.partySize,
                            })}{" "}
                            · {req.destination}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                        {req.message}
                      </p>
                      {req.contact && (
                        <p className="mt-2">
                          <code className="rounded-lg bg-background px-2 py-1 text-xs">
                            {req.contact}
                          </code>
                        </p>
                      )}

                      {respondingTo === req._id ? (
                        <div className="mt-3 space-y-3 border-t border-border/70 pt-3">
                          <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            placeholder={t("portal.note")}
                            className="bg-background"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={busy}
                              onClick={() => void decide("accepted")}
                            >
                              <Check className="size-4" />
                              {t("portal.confirm")} — {t("portal.accept")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              disabled={busy}
                              onClick={() => void decide("denied")}
                            >
                              <X className="size-4" />
                              {t("portal.confirm")} — {t("portal.deny")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={busy}
                              onClick={() => {
                                setRespondingTo(null);
                                setNote("");
                              }}
                            >
                              {t("portal.back")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2 border-t border-border/70 pt-3">
                          <Button
                            size="sm"
                            onClick={() => setRespondingTo(req._id)}
                          >
                            <Check className="size-4" />
                            {t("portal.accept")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:border-destructive/40 hover:text-destructive"
                            onClick={() => setRespondingTo(req._id)}
                          >
                            <X className="size-4" />
                            {t("portal.deny")}
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* History */}
            {resolved.length > 0 && (
              <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <History className="size-4" />
                  {t("portal.history")}
                </p>
                <ul className="mt-4 space-y-2">
                  {resolved.map((req) => (
                    <li
                      key={req._id}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-muted/30 p-3"
                    >
                      <AvatarChip name={req.travelerName} className="size-8" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {req.travelerName}
                          <span className="ml-2 font-normal text-muted-foreground">
                            {createdLabel(req.createdAt)}
                          </span>
                        </p>
                        {req.responseNote && (
                          <p className="truncate text-xs text-muted-foreground">
                            {req.responseNote}
                          </p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                          req.status === "accepted"
                            ? "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : req.status === "denied"
                              ? "border-destructive/40 bg-destructive/10 text-destructive"
                              : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {req.status === "accepted"
                          ? t("req.status.accepted")
                          : req.status === "denied"
                            ? t("req.status.denied")
                            : t("req.status.cancelled")}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-1.5">
      <p
        className={`font-display text-xl leading-none ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
