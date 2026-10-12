import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Hero } from "./hero";
import { CoffeeShowcase } from "./coffee-showcase";
import { ReviewsSection } from "./reviews-section";
import { ReservationCta } from "./reservation-cta";

type HomeShellProps = { locale: Locale; dictionary: Dictionary };

export function HomeShell({ locale, dictionary }: HomeShellProps) {
  return <div className="min-h-screen overflow-hidden"><SiteHeader locale={locale} dictionary={dictionary} /><main><Hero dictionary={dictionary} locale={locale} /><CoffeeShowcase locale={locale} dictionary={dictionary} /><ReviewsSection dictionary={dictionary} /><ReservationCta locale={locale} dictionary={dictionary} /></main><SiteFooter locale={locale} dictionary={dictionary} /></div>;
}
