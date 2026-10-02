import { api } from "@/convex/_generated/api";
import { Brand } from "@/components/Brand";
import { AvatarChip } from "@/components/app/catalog";
import { ContributeView } from "@/components/app/ContributeView";
import { DiscoverView } from "@/components/app/DiscoverView";
import { GuidesView } from "@/components/app/GuidesView";
import { TripsView } from "@/components/app/TripsView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  CalendarRange,
  Compass,
  Handshake,
  Home,
  LogOut,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

const TABS = [
  { value: "discover", label: "Discover", icon: Compass },
  { value: "trips", label: "My trips", icon: CalendarRange },
  { value: "guides", label: "Guides", icon: Handshake },
  { value: "contribute", label: "Contribute", icon: Users },
] as const;

type Tab = (typeof TABS)[number]["value"];

function isTab(value: string | null): value is Tab {
  return TABS.some((t) => t.value === value);
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const ensureSeed = useMutation(api.seed.ensureSeed);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // Fill the demo destinations/guides once (idempotent on the server).
  useEffect(() => {
    ensureSeed({}).catch(() => {
      /* seeding is best-effort */
    });
  }, [ensureSeed]);

  const rawTab = params.get("tab");
  const tab: Tab = isTab(rawTab) ? rawTab : "discover";
  const initialQuery = params.get("q") ?? "";

  const goTab = (next: Tab) => {
    const search = new URLSearchParams(params);
    search.set("tab", next);
    search.delete("q");
    setParams(search, { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <Brand />
            </button>
            <nav className="hidden items-center gap-1 md:flex">
              {TABS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                onClick={() => goTab(item.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  tab === item.value
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground lg:inline">
              Discover • Plan • Connect
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  aria-label="Account menu"
                >
                  <AvatarChip
                    name={user?.name || user?.email || "Traveller"}
                    className="size-9"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-medium">
                    {user?.name || "Traveller"}
                  </p>
                  {user?.email && (
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <Home className="size-4" />
                  Landing page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="flex gap-1 overflow-x-auto border-t border-border/70 px-4 py-2 md:hidden">
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => goTab(item.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                tab === item.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 md:py-10">
        {tab === "discover" && (
          <DiscoverView
            initialQuery={initialQuery}
            onViewTrip={() => goTab("trips")}
          />
        )}
        {tab === "trips" && <TripsView onBrowse={() => goTab("discover")} />}
        {tab === "guides" && (
          <GuidesView onGoToContribute={() => goTab("contribute")} />
        )}
        {tab === "contribute" && <ContributeView />}
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>
            Yatra Setu — Discover • Plan • Connect · by Team Desi Voyagers
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#d9a520]" />
            MVP v1 · under development
          </span>
        </div>
      </footer>
    </div>
  );
}
