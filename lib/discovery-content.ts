import type { Locale } from "./i18n";

export type DiscoveryPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  sections: { title: string; body: string }[];
  questions: { question: string; answer: string }[];
  menuCta: string;
  reservationCta: string;
};

export type MenuCategory = { title: string; description: string };

export const menuContent: Record<Locale, { eyebrow: string; title: string; intro: string; note: string; categories: MenuCategory[]; reservationCta: string }> = {
  de: {
    eyebrow: "Unsere Auswahl",
    title: "Speisekarte.",
    intro: "Frühstück, Matcha und guter Kaffee – für deine kleine Auszeit mitten in der Lübecker Altstadt.",
    note: "Unsere Auswahl kann saisonal wechseln. Bei Allergien oder besonderen Ernährungswünschen hilft dir unser Team gerne weiter.",
    categories: [
      { title: "Matcha", description: "Entdecke unsere aktuelle Matcha-Auswahl und saisonale Variationen direkt im Café." },
      { title: "Kaffee", description: "Guter Kaffee für den schnellen Stopp oder einen langen Moment am Tisch." },
      { title: "Frühstück", description: "Leckeres Frühstück für einen entspannten Start in den Tag." },
      { title: "Vegetarisch & vegan", description: "Vegetarische und vegane Optionen gehören zu unserer wechselnden Auswahl." },
    ],
    reservationCta: "Tisch reservieren",
  },
  en: {
    eyebrow: "Our selection",
    title: "Menu.",
    intro: "Breakfast, matcha, and good coffee for a little escape in the heart of Lübeck's Old Town.",
    note: "Our selection may change seasonally. If you have allergies or dietary requirements, our team will be happy to help.",
    categories: [
      { title: "Matcha", description: "Discover our current matcha selection and seasonal variations at the café." },
      { title: "Coffee", description: "Good coffee for a quick stop or a long moment at the table." },
      { title: "Breakfast", description: "Delicious breakfast for a relaxed start to the day." },
      { title: "Vegetarian & vegan", description: "Vegetarian and vegan options are part of our changing selection." },
    ],
    reservationCta: "Reserve a table",
  },
};

export const discoveryContent: Record<"matcha" | "cafe", Record<Locale, DiscoveryPageContent>> = {
  matcha: {
    de: {
      eyebrow: "Matcha in Lübeck",
      title: "Dein Matcha-Moment in der Altstadt.",
      intro: "Bei Altstadtliebe findest du Matcha mitten in Lübecks Altstadt – zum Ankommen, Genießen und Bleiben.",
      image: "/menu-matcha.jpeg",
      imageAlt: "Matcha von Altstadtliebe in Lübeck",
      sections: [
        { title: "Unsere aktuelle Auswahl", body: "Unsere Matcha-Auswahl kann saisonal wechseln. Im Café erfährst du, welche Variationen gerade für dich bereitstehen." },
        { title: "Matcha, Frühstück und Zeit", body: "Kombiniere deinen Matcha mit einem entspannten Frühstück oder genieße ihn als kleine Auszeit zwischendurch." },
        { title: "Mitten in Lübeck", body: "Du findest uns in der Mühlenstraße 51, nur wenige Schritte von den Wegen und Plätzen der Lübecker Altstadt entfernt." },
      ],
      questions: [
        { question: "Wo gibt es Matcha in Lübeck?", answer: "Bei Altstadtliebe in der Mühlenstraße 51, 23552 Lübeck – mitten in der Altstadt." },
        { question: "Kann ich für meinen Besuch reservieren?", answer: "Ja. Deinen Tisch kannst du direkt online reservieren. Spontane Besuche sind ebenfalls willkommen." },
        { question: "Gibt es vegane Optionen?", answer: "Ja. Bei besonderen Ernährungswünschen oder Allergien sprich bitte unser Team an." },
      ],
      menuCta: "Auswahl entdecken",
      reservationCta: "Tisch reservieren",
    },
    en: {
      eyebrow: "Matcha in Lübeck",
      title: "Your matcha moment in the Old Town.",
      intro: "Find matcha at Altstadtliebe in the heart of Lübeck's Old Town—a place to arrive, enjoy, and stay a little longer.",
      image: "/menu-matcha.jpeg",
      imageAlt: "Matcha from Altstadtliebe in Lübeck",
      sections: [
        { title: "Our current selection", body: "Our matcha selection may change seasonally. Visit the café to discover the variations currently available." },
        { title: "Matcha, breakfast, and time", body: "Pair your matcha with a relaxed breakfast or enjoy it as a little escape during your day." },
        { title: "In the heart of Lübeck", body: "Find us at Mühlenstraße 51, just a short walk from the streets and squares of Lübeck's Old Town." },
      ],
      questions: [
        { question: "Where can I find matcha in Lübeck?", answer: "At Altstadtliebe, Mühlenstraße 51, 23552 Lübeck, right in the Old Town." },
        { question: "Can I reserve a table?", answer: "Yes. You can reserve online, and walk-ins are always welcome too." },
        { question: "Are vegan options available?", answer: "Yes. Please speak to our team about dietary requirements or allergies." },
      ],
      menuCta: "Explore our selection",
      reservationCta: "Reserve a table",
    },
  },
  cafe: {
    de: {
      eyebrow: "Café in Lübeck",
      title: "Eine kleine Auszeit in Lübecks Altstadt.",
      intro: "Frühstück, Matcha und guter Kaffee in warmer Atmosphäre – bei Altstadtliebe in der Mühlenstraße.",
      image: "/menu-breakfast.jpeg",
      imageAlt: "Frühstück bei Altstadtliebe in Lübecks Altstadt",
      sections: [
        { title: "Frühstück & Kaffee", body: "Nimm dir Zeit für ein leckeres Frühstück, guten Kaffee und die kleinen Pausen, die bleiben." },
        { title: "Vegetarisch & vegan", body: "Unsere wechselnde Auswahl umfasst vegetarische und vegane Optionen. Bei Allergien hilft dir unser Team gerne weiter." },
        { title: "Spontan oder reserviert", body: "Du kannst jederzeit spontan vorbeikommen. Besonders zu den Stoßzeiten empfehlen wir eine Reservierung." },
      ],
      questions: [
        { question: "Wann ist Altstadtliebe geöffnet?", answer: "Dienstag bis Sonntag von 09:00 bis 18:00 Uhr. Montags bleibt das Café geschlossen." },
        { question: "Sind Hunde erlaubt?", answer: "Ja, Hunde sind herzlich willkommen. Bitte behalte deinen Vierbeiner in deiner Nähe." },
        { question: "Wo findet ihr uns?", answer: "In der Mühlenstraße 51, 23552 Lübeck – mitten in der wunderschönen Altstadt." },
      ],
      menuCta: "Speisekarte ansehen",
      reservationCta: "Tisch reservieren",
    },
    en: {
      eyebrow: "Café in Lübeck",
      title: "A little escape in Lübeck's Old Town.",
      intro: "Breakfast, matcha, and good coffee in a warm atmosphere at Altstadtliebe on Mühlenstraße.",
      image: "/menu-breakfast.jpeg",
      imageAlt: "Breakfast at Altstadtliebe in Lübeck's Old Town",
      sections: [
        { title: "Breakfast & coffee", body: "Make time for a delicious breakfast, good coffee, and the little pauses worth keeping." },
        { title: "Vegetarian & vegan", body: "Our changing selection includes vegetarian and vegan options. Our team will be happy to help with allergies." },
        { title: "Walk in or reserve", body: "Walk-ins are always welcome. We recommend reserving a table during busy hours." },
      ],
      questions: [
        { question: "When is Altstadtliebe open?", answer: "Tuesday to Sunday from 09:00 to 18:00. The café is closed on Mondays." },
        { question: "Are dogs allowed?", answer: "Yes, dogs are welcome. We simply ask that they stay close to you." },
        { question: "Where can we find you?", answer: "At Mühlenstraße 51, 23552 Lübeck, in the heart of the beautiful Old Town." },
      ],
      menuCta: "View the menu",
      reservationCta: "Reserve a table",
    },
  },
};
