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
  reviews: {
    eyebrow: string;
    placeholderNotice: string;
    previous: string;
    next: string;
    progressLabel: string;
    items: [{ quote: string; name: string; rating: string }, { quote: string; name: string; rating: string }, { quote: string; name: string; rating: string }];
  };
  reservation: {
    eyebrow: string;
    heading: string;
    description: string;
    cta: string;
    imageAlt: string;
  };
  location: {
    eyebrow: string;
    heading: string;
    description: string;
    addressLabel: string;
    addressLines: [string, string];
    hoursLabel: string;
    hours: [string, string, string];
    contactLabel: string;
    phoneLabel: string;
    phoneHref: string;
    directions: string;
    directionsHref: string;
    directionsNote: string;
    imageAlt: string;
  };
  footer: {
    claim: string;
    imprint: string;
    privacy: string;
    cookies: string;
    navHome: string;
    navMenu: string;
    navGallery: string;
    navReservations: string;
    navContact: string;
    contactLabel: string;
    hoursLabel: string;
    instagramLabel: string;
    instagramHref: string;
    languageLabel: string;
    wordmark: string;
    copyright: string;
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
  reviews: {
    eyebrow: "Liebe Worte.",
    placeholderNotice: "Entwicklungsplatzhalter — echte Bewertungen folgen.",
    previous: "Vorherige Bewertung",
    next: "Nächste Bewertung",
    progressLabel: "Bewertung {current} von {total}",
    items: [
      { quote: "Entwicklungsplatzhalter 01 — echte Bewertung folgt.", name: "Name folgt", rating: "Bewertung folgt" },
      { quote: "Entwicklungsplatzhalter 02 — echte Bewertung folgt.", name: "Name folgt", rating: "Bewertung folgt" },
      { quote: "Entwicklungsplatzhalter 03 — echte Bewertung folgt.", name: "Name folgt", rating: "Bewertung folgt" },
    ],
  },
  reservation: {
    eyebrow: "Reservierung",
    heading: "Dein Platz wartet.",
    description: "Nimm dir Zeit für einen guten Moment in der Altstadt.",
    cta: "Tisch reservieren",
    imageAlt: "Warmer, lichtdurchfluteter Innenraum von Altstadtliebe",
  },
  location: {
    eyebrow: "Besuch uns",
    heading: "Hier findest du uns.",
    description: "Komm vorbei, bleib ein wenig und lass dir Zeit für deinen Moment.",
    addressLabel: "Adresse",
    addressLines: ["Straße & Hausnummer folgen", "Lübeck"],
    hoursLabel: "Öffnungszeiten",
    hours: ["Mo–Fr — Zeiten folgen", "Sa — Zeiten folgen", "So — Zeiten folgen"],
    contactLabel: "Kontakt",
    phoneLabel: "Telefon — Platzhalter",
    phoneHref: "tel:+490000000000",
    directions: "Route planen",
    directionsHref: "https://www.google.com/maps/search/?api=1&query=Altstadtliebe%20L%C3%BCbeck",
    directionsNote: "Adresse folgt — Route wird nach Eintrag aktualisiert.",
    imageAlt: "Warmer Innenraum von Altstadtliebe mit Café-Tischen und Kaffeebar",
  },
  footer: {
    claim: "Mit Zeit gemacht.",
    imprint: "Impressum",
    privacy: "Datenschutz",
    cookies: "Cookie-Einstellungen",
    navHome: "Start",
    navMenu: "Menü",
    navGallery: "Galerie",
    navReservations: "Reservierungen",
    navContact: "Kontakt",
    contactLabel: "Kontakt",
    hoursLabel: "Öffnungszeiten",
    instagramLabel: "Instagram — Link folgt",
    instagramHref: "#instagram",
    languageLabel: "English",
    wordmark: "ALTSTADTLIEBE",
    copyright: "© Altstadtliebe",
  },
};
