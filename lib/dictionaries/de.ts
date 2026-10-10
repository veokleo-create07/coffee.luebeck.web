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
    eyebrow: string;
    title: string;
    intro: string;
    cta: string;
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
    eyebrow: "Altstadtliebe · Lübeck",
    title: "Kaffee mit\nCharakter.",
    intro: "Ein ruhiger Ort für guten Kaffee, klare Gedanken und die kleinen Pausen, die bleiben.",
    cta: "Mehr entdecken",
    note: "Unsere Geschichte beginnt hier.",
  },
  footer: {
    claim: "Mit Zeit gemacht.",
    imprint: "Impressum",
    privacy: "Datenschutz",
  },
};
