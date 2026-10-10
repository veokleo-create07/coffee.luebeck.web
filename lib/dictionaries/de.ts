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
    note: string;
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
    primaryCta: "Tisch reservieren",
    secondaryCta: "Menü entdecken",
    note: "Unsere Geschichte beginnt hier.",
  },
  footer: {
    claim: "Mit Zeit gemacht.",
    imprint: "Impressum",
    privacy: "Datenschutz",
  },
};
