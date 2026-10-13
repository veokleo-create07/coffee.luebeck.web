export type Dictionary = {
  navigation: {
    home: string;
    story: string;
    visit: string;
    menu: string;
    reviews: string;
    reservation: string;
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
    googleLink: string;
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
    booking: {
      title: string;
      intro: string;
      stepLabels: [string, string, string];
      dateLabel: string;
      guestsLabel: string;
      guestsSuffix: string;
      timeLabel: string;
      mockAvailability: string;
      noTimes: string;
      fullName: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      requests: string;
      optional: string;
      privacy: string;
      privacyText: string;
      requiredError: string;
      emailError: string;
      dateError: string;
      timeError: string;
      back: string;
      continue: string;
      review: string;
      edit: string;
      confirm: string;
      demoNotice: string;
      confirmationTitle: string;
      confirmationBody: string;
      startOver: string;
      summaryDate: string;
      summaryTime: string;
      summaryGuests: string;
      summaryDetails: string;
      dateFormatLocale: string;
    };
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
    reviews: "Worte",
    reservation: "Reservieren",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    switchTo: "English",
  },
  home: {
    title: "Bleib noch ein bisschen.",
    description: "Guter Kaffee, leckeres Frühstück und Momente, für die man gerne länger bleibt.",
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
    heading: "Kaffee & Frühstück.",
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
    placeholderNotice: "Originale Auszüge — Freigabe zur Veröffentlichung ausstehend.",
    googleLink: "Alle Bewertungen auf Google ansehen ↗",
    previous: "Vorherige Bewertung",
    next: "Nächste Bewertung",
    progressLabel: "Bewertung {current} von {total}",
    items: [
      { quote: "Ein wunderschönes Café mitten in der Altstadt von Lübeck.", name: "Dein Yoga", rating: "Freigabe ausstehend" },
      { quote: "The best strawberry matcha I’ve ever had", name: "lunar", rating: "Freigabe ausstehend" },
      { quote: "Leckeres Essen und schönes Ambiente mitten in der Stadt.", name: "Florian Bayram", rating: "Freigabe ausstehend" },
    ],
  },
  reservation: {
    eyebrow: "Reservierung",
    heading: "Dein Platz wartet.",
    description: "Nimm dir Zeit für einen guten Moment in der Altstadt.",
    cta: "Tisch reservieren",
    imageAlt: "Warmer, lichtdurchfluteter Innenraum von Altstadtliebe",
    booking: {
      title: "Deinen Tisch reservieren",
      intro: "Wähle deinen Besuch — ganz in Ruhe.",
      stepLabels: ["Besuch wählen", "Deine Daten", "Prüfen & bestätigen"],
      dateLabel: "Datum",
      guestsLabel: "Gäste",
      guestsSuffix: "Gäste",
      timeLabel: "Uhrzeit",
      mockAvailability: "Demo-Verfügbarkeit — noch nicht mit einem Buchungssystem verbunden.",
      noTimes: "Für dieses Datum sind keine Demo-Zeiten hinterlegt.",
      fullName: "Vollständiger Name",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail-Adresse",
      phone: "Telefon",
      requests: "Besondere Wünsche",
      optional: "optional",
      privacy: "Datenschutz",
      privacyText: "Ich stimme der Verarbeitung meiner Angaben zur Bearbeitung dieser Demo-Anfrage zu.",
      requiredError: "Bitte fülle dieses Feld aus.",
      emailError: "Bitte gib eine gültige E-Mail-Adresse ein.",
      dateError: "Bitte wähle ein gültiges Datum.",
      timeError: "Bitte wähle eine Uhrzeit.",
      back: "Zurück",
      continue: "Weiter",
      review: "Auswahl prüfen",
      edit: "Bearbeiten",
      confirm: "Reservierung bestätigen",
      demoNotice: "Demo-Flow — es wird keine echte Reservierung übermittelt.",
      confirmationTitle: "Danke für deine Anfrage.",
      confirmationBody: "Dies ist eine Demo-Bestätigung. Deine Angaben wurden nicht übermittelt und es wurde keine Reservierung angelegt.",
      startOver: "Neue Demo-Anfrage",
      summaryDate: "Datum",
      summaryTime: "Uhrzeit",
      summaryGuests: "Gäste",
      summaryDetails: "Deine Daten",
      dateFormatLocale: "de-DE",
    },
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
