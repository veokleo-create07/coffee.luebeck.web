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
  footer: {
    claim: "Mit Zeit gemacht.",
    imprint: "Impressum",
    privacy: "Datenschutz",
  },
};
