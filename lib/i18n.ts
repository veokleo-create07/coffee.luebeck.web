import { de, type Dictionary } from "./dictionaries/de";
import { en } from "./dictionaries/en";

export type Locale = "de" | "en";

const dictionaries: Record<Locale, Dictionary> = { de, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
