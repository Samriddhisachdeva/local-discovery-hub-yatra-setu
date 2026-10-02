import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  AvatarChip,
  Stars,
  VerifiedBadge,
} from "@/components/app/catalog";
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
import { useQuery } from "convex/react";
import {
  ArrowRight,
  Copy,
  Languages,
  MapPin,
  Search,
  SearchX,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

export function GuidesView({
  onGoToContribute,
}: {
  onGoToContribute: () => void;
}) {
  const guides = useQuery(api.guides.list);
  const myGuide = useQuery(api.guides.mine);
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
            Local guides
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Verified residents who can show you their home — filtered by
            language, expertise and reviews.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides, languages…"
              className="pl-9 sm:w-64"
            />
          </div>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-full sm:w-44">
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
          {myGuide ? "Open my profile" : "Become a guide"}
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
    </div>
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
          Connect
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
  const rating = guide.ratingCount ? guide.ratingSum / guide.ratingCount : 0;

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

        <ReviewsSection
          targetType="guide"
          targetId={guide._id}
          heading={`Reviews (${guide.ratingCount})`}
        />
      </div>
    </>
  );
}
