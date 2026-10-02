import { api } from "@/convex/_generated/api";
import { AvatarChip, Stars } from "@/components/app/catalog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { Flag, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TargetType = "place" | "guide";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Star picker (1–5) used in review forms. */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="rounded-sm p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <Star
            className={
              n <= value
                ? "size-5 fill-[#d9a520] text-[#d9a520]"
                : "size-5 text-foreground/20 transition-colors hover:text-foreground/40"
            }
          />
        </button>
      ))}
    </div>
  );
}

/** Reviews for a place or guide, with an inline "leave a review" form. */
export function ReviewsSection({
  targetType,
  targetId,
  heading = "Reviews",
}: {
  targetType: TargetType;
  targetId: string;
  heading?: string;
}) {
  const reviews = useQuery(api.community.forTarget, { targetType, targetId });
  const addReview = useMutation(api.community.add);
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await addReview({ targetType, targetId, rating, comment });
      setComment("");
      setRating(5);
      toast.success("Review posted", {
        description: "Thanks — it helps the next traveller.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not post review",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {heading}
      </p>

      {reviews && reviews.length > 0 ? (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="rounded-xl border border-border/70 bg-muted/30 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AvatarChip name={review.authorName} className="size-8" />
                  <div>
                    <p className="text-sm font-medium">{review.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <Stars value={review.rating} />
              </div>
              <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No reviews yet — be the first to share what you found.
        </p>
      )}

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <p className="text-sm font-medium">Leave a review</p>
        {isAuthenticated ? (
          <div className="mt-3 space-y-3">
            <StarPicker value={rating} onChange={setRating} />
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What was it actually like? Food, timing, tips…"
              rows={3}
              className="resize-none"
            />
            <Button
              size="sm"
              onClick={submit}
              disabled={busy || comment.trim().length < 5}
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              Post review
            </Button>
          </div>
        ) : (
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to share your experience.
          </p>
        )}
      </div>
    </div>
  );
}

const REPORT_REASONS = [
  { value: "fake", label: "Fake or misleading information" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "suspicious", label: "Suspicious profile" },
  { value: "location", label: "Incorrect location" },
  { value: "safety", label: "Unsafe experience" },
] as const;

/** Report button + dialog for places and guides (safety & moderation flow). */
export function ReportButton({
  targetType,
  targetId,
}: {
  targetType: TargetType;
  targetId: string;
}) {
  const report = useMutation(api.community.report);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("fake");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await report({
        targetType,
        targetId,
        reason: reason as (typeof REPORT_REASONS)[number]["value"],
        details: details.trim() || undefined,
      });
      setOpen(false);
      setDetails("");
      toast.success("Report submitted", {
        description: "Our moderation team will review this entry.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not submit report",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="size-4" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report this {targetType}</DialogTitle>
          <DialogDescription>
            Tell us what looks wrong. Reports go straight to moderation and are
            never shown publicly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-details">Details (optional)</Label>
            <Textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Anything specific we should check?"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
