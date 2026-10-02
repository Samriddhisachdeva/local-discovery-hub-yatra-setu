import { Brand } from "@/components/Brand";
import {
  AvatarChip,
  PlaceCover,
  Stars,
  VerifiedBadge,
} from "@/components/app/catalog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  Compass,
  Gem,
  Handshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#locals", label: "For locals" },
  { href: "#safety", label: "Safety" },
];

const STEPS = [
  {
    n: "01",
    icon: Compass,
    title: "Discover",
    body: "Search a destination and browse both the landmarks and the lesser-known places locals actually recommend — food, markets, routes, nature and culture.",
  },
  {
    n: "02",
    icon: CalendarRange,
    title: "Plan",
    body: "Drop the places you like into a day-wise itinerary. Reorder stops, move them across days, and shape the trip around your time and budget.",
  },
  {
    n: "03",
    icon: Handshake,
    title: "Connect",
    body: "Find verified local guides by language and expertise, read traveller reviews, and reach out directly — no middlemen, no packages.",
  },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Local discovery",
    body: "Eight categories from historical sites to hidden attractions, so you can browse a city by mood instead of by rank.",
  },
  {
    icon: Users,
    title: "Recommendations from locals",
    body: "Every entry is contributed by someone who lives there — the lane, the stall, the viewpoint that never makes the lists.",
  },
  {
    icon: CalendarRange,
    title: "Day-wise itinerary",
    body: "Build Day 1, Day 2 and beyond. Reorder stops, shift them between days, and keep your plan in one place.",
  },
  {
    icon: BadgeCheck,
    title: "Verified guides",
    body: "Languages, years of experience, expertise and reviews for every guide — with a verification badge you can trust.",
  },
  {
    icon: ShieldCheck,
    title: "Safety built in",
    body: "Ratings, a report flow for fake or unsafe content, verification states, and emergency numbers for every trip.",
  },
  {
    icon: Sprout,
    title: "Value that stays local",
    body: "Guides, food walks, craft villages and community experiences — tourism spend that reaches the people hosting you.",
  },
];

const DESTINATIONS = [
  {
    name: "Varanasi",
    count: 6,
    blurb: "Ghats, weavers' lanes & old-city food",
    icon: Sparkles,
    tint: "from-[#f8ebe6] to-[#f0d8cf]",
  },
  {
    name: "Hampi",
    count: 5,
    blurb: "Ruins, coracles & boulder lakes",
    icon: Gem,
    tint: "from-[#f1ece3] to-[#e2d9c9]",
  },
  {
    name: "Shillong",
    count: 5,
    blurb: "Canyons, markets & sacred groves",
    icon: Sprout,
    tint: "from-[#e8f1e9] to-[#d5e6da]",
  },
  {
    name: "Madurai",
    count: 4,
    blurb: "Temple town, tanks & sweet shops",
    icon: Users,
    tint: "from-[#efeaf3] to-[#e0d8ed]",
  },
  {
    name: "Bhuj",
    count: 4,
    blurb: "Palaces, looms & desert roads",
    icon: MapPin,
    tint: "from-[#f4ece6] to-[#ead7ca]",
  },
];

const TRAVELLER_POINTS = [
  "Search a destination and see popular + hidden places side by side",
  "Read local tips: where to eat, when to go, how to get there",
  "Save places into a personalised, day-wise itinerary",
  "Compare verified guides by language, expertise and reviews",
  "Leave reviews and report anything that feels off",
];

const LOCAL_POINTS = [
  "Add the places, food and routes outsiders never hear about",
  "Share cultural knowledge — festivals, crafts, histories, markets",
  "Apply to become a verified local guide and earn from your expertise",
  "Build credibility through traveller reviews and ratings",
  "See your community benefit from the visitors it hosts",
];

const TRUST = [
  {
    icon: BadgeCheck,
    title: "Identity verification",
    body: "Guide profiles pass a verification step before they appear to travellers.",
  },
  {
    icon: Sparkles,
    title: "Reviews & ratings",
    body: "Every place and guide carries ratings from travellers who were actually there.",
  },
  {
    icon: ShieldCheck,
    title: "Report & moderation",
    body: "Fake information, unsafe experiences and suspicious profiles can be reported in one tap.",
  },
  {
    icon: MapPin,
    title: "Emergency access",
    body: "National and tourist emergency numbers stay one tap away while you travel.",
  },
];

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const appHref = (path: string) =>
    isAuthenticated ? path : `/auth?returnTo=${encodeURIComponent(path)}`;

  const go = (path = "/dashboard") => navigate(appHref(path));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => go()}
            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <Brand />
          </button>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              onClick={() => go()}
            >
              Sign in
            </Button>
            <Button onClick={() => go()}>
              Get started
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-primary/[0.07] blur-3xl"
        />
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
              <span className="size-1.5 rounded-full bg-primary" />
              Local-first tourism · by Desi Voyagers
            </span>
            <h1 className="mt-6 text-balance font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-[4.25rem]">
              See the place the way{" "}
              <span className="italic text-primary">its people</span> do.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Yatra Setu is a bridge between travellers and local communities.
              Discover lesser-known places through the people who live there,
              plan a day-wise itinerary, and connect with verified local guides
              — all in one platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => go()}>
                Start discovering
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how">See how it works</a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "Verified local guides",
                "Day-wise itinerary planner",
                "Reviews, reports & safety info",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product composition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md space-y-4 lg:max-w-none"
          >
            <div className="relative rounded-3xl border border-border/80 bg-card p-4 shadow-lifted">
              <PlaceCover
                category="spiritual"
                className="h-40 rounded-2xl"
                iconSize="size-28"
              />
              <div className="space-y-1 px-1 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl leading-tight">
                      Assi Ghat at Dawn
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      Varanasi · Spiritual
                    </p>
                  </div>
                  <Stars value={4.5} count={2} />
                </div>
                <p className="pt-1 text-sm leading-6 text-muted-foreground">
                  “Be on the steps by 5:15 AM — the aarti ends before the tour
                  boats arrive.”
                </p>
                <p className="pb-1 text-xs font-medium text-primary">
                  Tip from a local contributor
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-2xl border border-border/80 bg-card p-3 shadow-lifted"
              >
                <p className="flex items-center justify-between px-1 pb-2 text-xs font-semibold">
                  Day 1 · Varanasi
                  <span className="font-normal text-muted-foreground">
                    4 stops
                  </span>
                </p>
                <ul className="space-y-1.5">
                  {[
                    ["Assi Ghat at Dawn", "Spiritual"],
                    ["Godowlia Chaat Lane", "Food"],
                    ["Sarai Mohana Weavers", "Market"],
                  ].map(([name, cat]) => (
                    <li
                      key={name}
                      className="flex items-center justify-between rounded-lg bg-muted/70 px-2.5 py-1.5 text-xs"
                    >
                      <span className="truncate font-medium">{name}</span>
                      <span className="pl-2 text-muted-foreground">{cat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-lifted sm:p-4"
              >
                <AvatarChip name="Ramesh Tiwari" className="size-9" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    Ramesh Tiwari
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Boatman · Varanasi
                  </p>
                  <VerifiedBadge className="mt-1" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <Section id="how" className="border-t border-border/70 bg-muted/30">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            How Yatra Setu works
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Discover → Plan → Connect
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            One simple loop for travellers — and a matching one for the locals
            who make each destination worth visiting.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <motion.div
              key={step.n}
              {...fadeUp}
              className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </span>
                <span className="font-display text-3xl text-foreground/15">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Destinations ───────────────────────────────────────── */}
      <Section>
        <motion.div
          {...fadeUp}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Live destinations
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              Start with a city, find what guides skip
            </h2>
          </div>
          <Button variant="outline" onClick={() => go()}>
            Browse all places
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DESTINATIONS.map((dest) => (
            <motion.button
              key={dest.name}
              {...fadeUp}
              type="button"
              onClick={() =>
                go(`/dashboard?tab=discover&q=${encodeURIComponent(dest.name)}`)
              }
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-lifted"
            >
              <div
                className={cn(
                  "relative h-24 overflow-hidden bg-gradient-to-br",
                  dest.tint,
                )}
              >
                <div className="grain absolute inset-0 opacity-60" />
                <dest.icon
                  className="absolute -bottom-3 -right-2 size-16 text-foreground/10"
                  strokeWidth={1.1}
                />
              </div>
              <div className="p-4">
                <p className="font-semibold tracking-tight">{dest.name}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {dest.blurb}
                </p>
                <p className="mt-3 text-xs font-medium text-primary">
                  {dest.count} local places →
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* ── Features ───────────────────────────────────────────── */}
      <Section id="features" className="border-t border-border/70 bg-muted/30">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Key features
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Everything a destination keeps — organised
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Not a hotel directory, not a package catalogue. Hyperlocal
            information about places, food, routes, culture and the people who
            can show you around.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              {...fadeUp}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-soft"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Two-sided ecosystem ────────────────────────────────── */}
      <Section id="locals">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            A two-sided ecosystem
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Built for travellers and locals alike
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="rounded-3xl border border-border/80 bg-card p-7 shadow-soft sm:p-9"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="size-5" />
            </span>
            <h3 className="mt-5 font-display text-2xl">For travellers</h3>
            <ul className="mt-5 space-y-3">
              {TRAVELLER_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
            <Button className="mt-7" onClick={() => go()}>
              Plan a trip
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="rounded-3xl border border-primary/25 bg-primary/[0.05] p-7 shadow-soft sm:p-9"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Users className="size-5" />
            </span>
            <h3 className="mt-5 font-display text-2xl">For locals</h3>
            <ul className="mt-5 space-y-3">
              {LOCAL_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
            <Button
              className="mt-7"
              variant="outline"
              onClick={() => go("/dashboard?tab=contribute")}
            >
              Contribute your knowledge
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* ── Safety ─────────────────────────────────────────────── */}
      <Section id="safety" className="border-t border-border/70 bg-muted/30">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Safety & verification
          </p>
          <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Trust is part of the product
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Connecting travellers with community members only works when both
            sides feel safe. Yatra Setu ships verification, reviews, reporting
            and emergency information from day one.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((item) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft"
            >
              <item.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── CTA band ───────────────────────────────────────────── */}
      <Section>
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-primary px-7 py-14 text-center text-primary-foreground sm:px-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <p className="relative font-display text-3xl leading-tight sm:text-5xl">
            Discover local. Plan better.
            <br className="hidden sm:block" /> Connect with people.
          </p>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
            Join the first version of Yatra Setu as a traveller or a local
            contributor — and help document the places, food and traditions that
            deserve to be seen.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
              onClick={() => go()}
            >
              Get started free
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => go("/dashboard?tab=contribute")}
            >
              I'm a local
            </Button>
          </div>
        </motion.div>
      </Section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Brand />
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              A local-first tourism platform connecting travellers with the
              communities that know each destination best.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-[#d9a520]" />
              MVP v1 · currently under development
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="font-semibold tracking-tight">Explore</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold tracking-tight">Project</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <button
                    type="button"
                    onClick={() => go()}
                    className="transition-colors hover:text-foreground"
                  >
                    Open the app
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go("/dashboard?tab=contribute")}
                    className="transition-colors hover:text-foreground"
                  >
                    Contribute a place
                  </button>
                </li>
                <li>Team Desi Voyagers</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border/70">
          <p className="mx-auto w-full max-w-6xl px-5 py-5 text-xs text-muted-foreground sm:px-8">
            Yatra Setu — Discover • Plan • Connect
          </p>
        </div>
      </footer>
    </div>
  );
}
