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
    experiences: [{ title: string; description: string; imageAlt: string }, { title: string; description: string; imageAlt: string }, { title: string; description: string; imageAlt: string }];
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
    heading: string;
    emptyNotice: string;
    placeholderNotice: string;
    googleLink: string;
    previous: string;
    next: string;
    progressLabel: string;
    items: [{ quote: string; name: string; rating: string }, { quote: string; name: string; rating: string }, { quote: string; name: string; rating: string }];
  };
  events: {
    heading: string;
    subtitle: string;
    privateTitle: string;
    privateDescription: string;
    cateringTitle: string;
    cateringDescription: string;
    featureHeading: string;
    featureDescription: string;
    featureCta: string;
    privateImageAlt: string;
    cateringImageAlt: string;
    featureImageAlt: string;
  };
  reservation: {
    eyebrow: string;
    heading: string;
    description: string;
    cta: string;
    imageAlt: string;
    booking: {
      title: string;
      stepLabels: [string, string];
      dateLabel: string;
      guestsLabel: string;
      guestsSuffix: string;
      timeLabel: string;
      fullyBooked: string;
      fullyBookedCall: string;
      alternativeTimes: string;
      fullyBookedOr: string;
      closeDialog: string;
      availabilityError: string;
      loadingAvailability: string;
      closedDayError: string;
      closedDayMessage: string;
      dateRangeError: string;
      moreThanSix: string;
      moreThanSixMessage: string;
      callCafe: string;
      durationNotice: string;
      fullName: string;
      email: string;
      requests: string;
      optional: string;
      requiredError: string;
      emailError: string;
      timeError: string;
      back: string;
      continue: string;
      chooseTime: string;
      confirm: string;
      confirmationTitle: string;
      confirmationBody: string;
      pendingTitle: string;
      pendingBody: string;
      startOver: string;
      summaryDate: string;
      summaryTime: string;
      summaryGuests: string;
      summaryDuration: string;
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
    hours: string[];
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
    navHome: string;
    navMenu: string;
    navGallery: string;
    navReservations: string;
    navFaq: string;
    contactLabel: string;
    hoursLabel: string;
    brandTagline: string;
    contactActionsLabel: string;
    callLabel: string;
    instagramLabel: string;
    instagramHref: string;
    languageLabel: string;
    tiktokLabel: string;
    tiktokHref: string;
    wordmark: string;
    copyright: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: string;
    items: { question: string; answer: string }[];
  };
};

export const de: Dictionary = {
  navigation: {
    home: "Start",
    story: "Über uns",
    visit: "Besuch",
    menu: "Speisekarte",
    reviews: "Gästestimmen",
    reservation: "Reservieren",
    openMenu: "Navigation öffnen",
    closeMenu: "Navigation schließen",
    switchTo: "English",
  },
  home: {
    title: "Dein Lieblingsplatz in der Altstadt.",
    description: "Frühstück, Matcha und guter Kaffee mitten in der Lübecker Altstadt.",
    primaryCta: "Reservieren",
    secondaryCta: "Einblicke",
    imageAlt: "Getränke von Altstadtliebe im Café fotografiert",
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
    heading: "Worauf hast du heute Lust?",
    description: "Drei Wege, deinen Moment in der Altstadt zu genießen.",
    cta: "Speisekarte entdecken",
    imageAlt: "Café-Atmosphäre von Altstadtliebe mit gedeckten Tischen und Kaffeebar",
    experiences: [
      { title: "Matcha", description: "Für deinen grünen Glücksmoment.", imageAlt: "Fruchtiger Matcha von Altstadtliebe" },
      { title: "Frühstück", description: "Weil gute Morgen länger dauern dürfen.", imageAlt: "Frühstück und Matcha von Altstadtliebe" },
      { title: "Kaffee", description: "Ein guter Kaffee. Ein bisschen Zeit für dich.", imageAlt: "Kaffee von Altstadtliebe" },
    ],
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
    eyebrow: "Gästestimmen",
    heading: "Stimmen, die bleiben.",
    emptyNotice: "Unsere Google Bewertungen werden hier bald zu sehen sein.",
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
  events: {
    heading: "Mehr als ein Café.",
    subtitle: "Besondere Anlässe verdienen besondere Momente. Ob Geburtstag, Firmenfeier oder ein anderer Anlass – wir machen ihn mit ein bisschen Altstadtliebe noch schöner.",
    privateTitle: "Private Feiern",
    privateDescription: "Ob Geburtstag, Hochzeit oder ein besonderer Anlass – wir helfen dir, deine schönsten Momente noch ein bisschen besonderer zu machen.",
    cateringTitle: "Catering mit Liebe",
    cateringDescription: "Von köstlichen Frühstückslieblingen bis zu Kaffee und Matcha – wir stellen ein individuelles Catering ganz nach deinen Wünschen zusammen.",
    featureHeading: "Ganz nach deinen Wünschen.",
    featureDescription: "Du planst eine Firmenfeier, einen Geburtstag oder ein besonderes Event? Erzähl uns von deinen Ideen und gemeinsam finden wir das passende Angebot.",
    featureCta: "Kontakt aufnehmen",
    privateImageAlt: "Elegante Matcha-Bar mit Blick auf den Lübecker Hafen",
    cateringImageAlt: "Altstadtliebe Café mit Kuchenvitrine, Kaffee und Matcha",
    featureImageAlt: "Zwei Matcha-Getränke von Altstadtliebe zum Mitnehmen",
  },
  reservation: {
    eyebrow: "Reservierung",
    heading: "Dein Platz wartet.",
    description: "Wähle deinen Wunschtermin und sichere dir deinen Platz bei Altstadtliebe.",
    cta: "Tisch reservieren",
    imageAlt: "Warmer, lichtdurchfluteter Innenraum von Altstadtliebe",
    booking: {
      title: "Reserviere deinen Tisch.",
      stepLabels: ["Besuch wählen", "Deine Daten"],
      dateLabel: "Datum",
      guestsLabel: "Gäste",
      guestsSuffix: "Gäste",
      timeLabel: "Uhrzeit wählen",
      fullyBooked: "Diese Uhrzeit ist sehr gefragt!",
      fullyBookedCall: "Vielleicht finden wir trotzdem noch einen Tisch für dich. Ruf uns kurz an – wir prüfen das gern!",
      alternativeTimes: "Wähle eine andere verfügbare Uhrzeit",
      fullyBookedOr: "oder",
      closeDialog: "Hinweis schließen",
      availabilityError: "Die Verfügbarkeit konnte gerade nicht geladen werden. Bitte versuche es erneut.",
      loadingAvailability: "Verfügbarkeit wird geladen …",
      closedDayError: "Montags ist das Café geschlossen.",
      closedDayMessage: "Entschuldigung, montags haben wir geschlossen. Bitte wähle einen anderen Tag für deinen Besuch.",
      dateRangeError: "Bitte wähle ein Datum innerhalb der nächsten sechs Monate.",
      moreThanSix: "Mehr als 6 Personen?",
      moreThanSixMessage: "Für größere Gruppen ruf uns bitte direkt an.",
      callCafe: "Café anrufen",
      durationNotice: "Dein Tisch ist für 1 Stunde und 30 Minuten reserviert.",
      fullName: "Vollständiger Name",
      email: "E-Mail-Adresse",
      requests: "Besondere Wünsche",
      optional: "optional",
      requiredError: "Bitte fülle dieses Feld aus.",
      emailError: "Bitte gib eine gültige E-Mail-Adresse ein.",
      timeError: "Bitte wähle eine Uhrzeit.",
      back: "Zurück",
      continue: "Weiter",
      chooseTime: "Uhrzeit wählen",
      confirm: "Reservierung bestätigen",
      confirmationTitle: "Deine Reservierung ist bestätigt.",
      confirmationBody: "Wir freuen uns auf deinen Besuch.",
      pendingTitle: "Deine Reservierung ist bestätigt.",
      pendingBody: "Wir freuen uns auf deinen Besuch.",
      startOver: "Zur Startseite",
      summaryDate: "Datum",
      summaryTime: "Uhrzeit",
      summaryGuests: "Gäste",
      summaryDuration: "Dauer",
      dateFormatLocale: "de-DE",
    },
  },
  location: {
    eyebrow: "Besuch uns",
    heading: "Hier findest du uns.",
    description: "Komm vorbei, bleib ein wenig und lass dir Zeit für deinen Moment.",
    addressLabel: "Adresse",
    addressLines: ["Mühlenstraße 51", "23552 Lübeck, Deutschland"],
    hoursLabel: "Öffnungszeiten",
    hours: ["Montag · geschlossen", "Dienstag–Sonntag · 09:00–18:00"],
    contactLabel: "Kontakt",
    phoneLabel: "+49 451 61917800",
    phoneHref: "tel:+4945161917800",
    directions: "Route planen",
    directionsHref: "https://www.google.com/maps/search/?api=1&query=M%C3%BChlenstra%C3%9Fe%2051%2C%2023552%20L%C3%BCbeck%2C%20Germany",
    directionsNote: "Mühlenstraße 51, 23552 Lübeck, Deutschland",
    imageAlt: "Warmer Innenraum von Altstadtliebe mit Café-Tischen und Kaffeebar",
  },
  footer: {
    claim: "Mit Zeit gemacht.",
    imprint: "Impressum",
    privacy: "Datenschutz",
    navHome: "Start",
    navMenu: "Speisekarte",
    navGallery: "Galerie",
    navReservations: "Reservierungen",
    navFaq: "FAQ",
    contactLabel: "Kontakt",
    hoursLabel: "Öffnungszeiten",
    brandTagline: "breakfast & lunch",
    contactActionsLabel: "Kontaktmöglichkeiten",
    callLabel: "Altstadtliebe anrufen",
    instagramLabel: "Instagram",
    instagramHref: "https://www.instagram.com/altstadtliebe.luebeck/",
    languageLabel: "English",
    tiktokLabel: "TikTok",
    tiktokHref: "https://www.tiktok.com/@altstadtliebe.luebeck",
    wordmark: "ALTSTADTLIEBE",
    copyright: "© Altstadtliebe",
  },
  faq: {
    eyebrow: "Fragen & Antworten",
    title: "Häufig gefragt.",
    intro: "Alles, was du über deinen Besuch bei Altstadtliebe wissen möchtest.",
    cta: "Tisch reservieren",
    items: [
      { question: "Wo findet ihr uns?", answer: "Ihr findet uns in der Mühlenstraße 51, 23552 Lübeck – mitten in der wunderschönen Altstadt." },
      { question: "Wann habt ihr geöffnet?", answer: "Wir haben von Dienstag bis Sonntag von 09:00 bis 18:00 Uhr geöffnet. Montags bleibt unser Café geschlossen." },
      { question: "Kann ich einen Tisch reservieren?", answer: "Na klar! Ihr könnt euren Tisch ganz einfach über unsere Website reservieren. Für Gruppen mit mehr als sechs Personen meldet euch bitte direkt bei uns." },
      { question: "Kann ich auch spontan vorbeikommen?", answer: "Natürlich! Ihr könnt jederzeit auch ohne Reservierung vorbeikommen. Besonders zu den Stoßzeiten empfehlen wir euch aber, vorher einen Tisch zu reservieren." },
      { question: "Gibt es bei euch vegane und vegetarische Optionen?", answer: "Ja! Auf unserer Speisekarte findet ihr auch vegetarische und vegane Optionen. Bei Allergien oder besonderen Ernährungswünschen sprecht einfach unser Team an. Wir helfen euch gerne weiter." },
      { question: "Sind Hunde bei euch erlaubt?", answer: "Ja, Hunde sind bei uns herzlich willkommen! Wir bitten euch nur, eure Vierbeiner in eurer Nähe zu behalten, damit sich alle Gäste wohlfühlen." },
      { question: "Bietet ihr private Feiern und Catering an?", answer: "Ja! Ob Geburtstag, Hochzeit, Firmenfeier oder ein anderer besonderer Anlass – wir bieten private Feiern und individuelles Catering an. Kontaktiert uns einfach, und gemeinsam finden wir das passende Angebot für euch." },
    ],
  },
};
