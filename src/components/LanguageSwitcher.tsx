import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/i18n";
import { LANGUAGES, type Lang } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Check, Languages } from "lucide-react";

/** Globe dropdown that switches the whole app between supported languages. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5 px-2", className)}
          aria-label={t("lang.label")}
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline">
            {LANGUAGES.find((l) => l.code === lang)?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("lang.label")}
        </DropdownMenuLabel>
        {LANGUAGES.map((item: { code: Lang; label: string }) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => setLang(item.code)}
            className="justify-between"
          >
            {item.label}
            {lang === item.code && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
