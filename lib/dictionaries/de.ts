export type Dictionary = {
  navigation: {
    home: string;
    story: string;
    visit: string;
    menu: string;
    openMenu: string;
    closeMenu: string;
    switchTo: string;
  };
  home: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    imageAlt: string;
    note: string;
  };
  story: {
    eyebrow: string;
    heading: string;
    description: string;
    imageAlt: string;
  };
  showcase: {
    eyebrow: string;
    heading: string;
    description: string;
    cta: string;
    imageAlt: string;
  };
  gallery: {
    eyebrow: string;
    heading: string;
    description: string;
    link: string;
    imageAlts: [string, string, string, string];
  };
  footer: {
    claim: string;
    imprint: string;
    privacy: string;
  };
};

export const de: Dictionary = {
  navigation: {
    home: "Start",
    story: "Über uns",
    visit: "Besuch",
    menu: "Menü",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    switchTo: "English",
  },
  home: {
    title: "Coffee with character.",
    description: "Guter Kaffee, schöne Morgen und ein Ort, an dem man gern ein wenig länger bleibt.",
    primaryCta: "Reservieren",
    secondaryCta: "Entdecken",
    imageAlt: "Warmer, lichtdurchfluteter Innenraum von Altstadtliebe",
    note: "Unsere Geschichte beginnt hier.",
  },
  story: {
    eyebrow: "Ein Ort zum Bleiben",
    heading: "Ein bisschen Altstadtliebe.",
    description: "Ein Ort für guten Kaffee, ausgedehnte Frühstücke und Momente, die man gern verlängert.",
    imageAlt: "Sonniger Innenraum von Altstadtliebe mit Café-Tischen und Blumen",
  },
  showcase: {
    eyebrow: "Kaffee & Frühstück",
    heading: "Für die kleinen großen Momente.",
    description: "Guter Kaffee, leckeres Frühstück und Zeit zum Genießen.",
    cta: "Speisekarte entdecken",
    imageAlt: "Café-Atmosphäre von Altstadtliebe mit gedeckten Tischen und Kaffeebar",
  },
  gallery: {
    eyebrow: "Einblicke",
    heading: "Momente, die bleiben.",
    description: "Licht, Wärme und die kleinen Details, die aus einem Besuch eine Erinnerung machen.",
    link: "Mehr entdecken",
    imageAlts: [
      "Lichtdurchfluteter Innenraum von Altstadtliebe",
      "Kaffeebar und warme Details im Café",
      "Gedeckte Tische und Blumen im Innenraum",
      "Café-Atmosphäre mit Blick durch den Raum",
    ],
  },
  footer: {
    claim: "Mit Zeit gemacht.",
    imprint: "Impressum",
    privacy: "Datenschutz",
  },
};
