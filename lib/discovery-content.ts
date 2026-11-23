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

export type MenuItem = {
  number?: number;
  name: string;
  description?: string;
  price: string;
  priceValue: number;
  extras?: string;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
  extras?: string;
};

export type MenuContent = {
  eyebrow: string;
  title: string;
  intro: string;
  note: string;
  categories: MenuCategory[];
  sections: MenuSection[];
  reservationCta: string;
};

export const menuContent: Record<Locale, MenuContent> = {
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
    sections: [
      {
        title: "Ei-, Brot- & Liebe",
        items: [
          {
            name: "Rührei auf Sauerteigbrot",
            description: "Rührei aus frischen Bio-Freilandeiern, Sauerteigbrot, wahlweise mit Butter oder Tomatenpesto.",
            price: "11,50 €",
            priceValue: 11.5,
          },
          {
            name: "Avocado auf Sauerteigbrot",
            description: "Sauerteigbrot, hausgemachte Avocadocreme, Rote-Bete-Hummus, Rucola.",
            price: "12,90 €",
            priceValue: 12.9,
            extras: "Extras: Rührei +5 € | Champignons +3,50 € | Feta +3 € | Avocado +3 € | Räucherlachs +5 €",
          },
          {
            name: "Egg Benedict",
            description: "Pochierte Eier auf Sauerteigbrot, hausgemachte Avocadocreme, Räucherlachs, Rucola & Sauce Hollandaise.",
            price: "16,90 €",
            priceValue: 16.9,
          },
          {
            name: "Shakshuka",
            description: "Zwei Bio-Freilandeier in aromatischer Tomaten-Paprika-Sauce mit Babyspinat & Feta, serviert mit zwei knusprig gerösteten Scheiben Sauerteigbrot.",
            price: "13,90 €",
            priceValue: 13.9,
          },
          {
            name: "Orientalisches Frühstück",
            description: "Rührei aus frischen Bio-Freilandeiern, Brot, Sucuk, Gurke, Tomate, Oliven, Hirtenkäse, Honig mit Frischkäse, Auberginencreme.",
            price: "15,90 €",
            priceValue: 15.9,
          },
          {
            name: "Turkish Eggs",
            description: "Pochierte Eier auf cremigem Knoblauchjoghurt mit würziger Paprikabutter & zwei knusprig gerösteten Scheiben Sauerteigbrot.",
            price: "14,90 €",
            priceValue: 14.9,
          },
        ],
      },
      {
        title: "Bagels",
        items: [
          {
            number: 1,
            name: "Bagel Lachs",
            description: "Frischkäse, Räucherlachs, Honig-Senf-Sauce, frischer Dill & Rucola",
            price: "9,50 €",
            priceValue: 9.5,
          },
          {
            number: 2,
            name: "Bagel Chicken",
            description: "Crispy Chicken, Cheddar, Tomatenpesto & Salat",
            price: "8,90 €",
            priceValue: 8.9,
          },
          {
            number: 3,
            name: "Bagel Avocado",
            description: "Rührei, cremige Avocado, vegane Aioli, Rucola & ein Hauch Limettensaft",
            price: "9,50 €",
            priceValue: 9.5,
          },
          {
            number: 4,
            name: "Bagel Classic",
            description: "Frischkäse, Tomate",
            price: "6,50 €",
            priceValue: 6.5,
          },
        ],
      },
      {
        title: "Bowls",
        items: [
          {
            number: 5,
            name: "Chicken Bowl",
            description: "Couscous, Hähnchen, Feta, Cherrytomaten, Gurke, Rote Beete, Salat & hausgemachte Sauce",
            price: "13,90 €",
            priceValue: 13.9,
          },
          {
            number: 6,
            name: "Mediterrane Bowl",
            description: "Couscous, Grillgemüse, Feta, Cherrytomaten, Gurke, Avocado, Salat & hausgemachte Sauce",
            price: "12,90 €",
            priceValue: 12.9,
          },
          {
            number: 7,
            name: "Lachs Bowl",
            description: "Couscous, Räucherlachs, Cherrytomaten, Gurke, Avocado, Rucola & Honig-Senf-Dressing",
            price: "14,90 €",
            priceValue: 14.9,
          },
        ],
      },
      {
        title: "Süßes mit Liebe",
        items: [
          {
            number: 1,
            name: "Pancakes",
            description: "Pancakes mit reinem Ahornsirup, Puderzucker & einer Auswahl an frischen Früchten",
            price: "10,50 €",
            priceValue: 10.5,
          },
          {
            number: 2,
            name: "Belgische Waffeln",
            description: "Frisch gebackene Waffel mit Puderzucker & frischen Früchten",
            price: "10,50 €",
            priceValue: 10.5,
          },
          {
            number: 3,
            name: "Açaí Bowl",
            description: "Açaí mit einer Auswahl an frischen Früchten, Granola, Kokosraspeln & Chiasamen",
            price: "11,50 €",
            priceValue: 11.5,
          },
          {
            number: 4,
            name: "Joghurt Bowl",
            description: "Griechischer Joghurt mit Honig, frischen Früchten, Granola, Chiasamen & Kokosraspeln",
            price: "9,50 €",
            priceValue: 9.5,
          },
        ],
        extras: "Extras: Pistaziencreme +3,50 € | Schoki +2,50 € | Erdnussmus +3,00 €",
      },
      {
        title: "Iced-Matcha-Latte",
        items: [
          { number: 5, name: "Iced Matcha Latte", price: "5,80 €", priceValue: 5.8 },
          { number: 6, name: "Strawberry Iced Matcha", price: "6,40 €", priceValue: 6.4 },
          { number: 7, name: "Mango Iced Matcha", price: "6,40 €", priceValue: 6.4 },
          { number: 8, name: "Cherry Vanilla Iced Matcha", price: "6,70 €", priceValue: 6.7 },
        ],
        extras: "Extras: Sirup +0,50 € | Hafermilch +0,40 € | Kokosmilch +0,50 €",
      },
      {
        title: "Frische Limonade",
        items: [
          { number: 1, name: "Limette Minze", description: "Minze, Limette", price: "5,50 €", priceValue: 5.5 },
          { number: 2, name: "Beeren Mix", description: "Frische Beeren, Zitrone, Minze", price: "5,50 €", priceValue: 5.5 },
          { number: 3, name: "Kokos Blaubeere", description: "Frische Blaubeeren, Kokos", price: "5,50 €", priceValue: 5.5 },
        ],
      },
      {
        title: "Säfte",
        items: [
          { number: 4, name: "Frischer Orangensaft", description: "Mit frisch gepressten Orangen", price: "5,50 €", priceValue: 5.5 },
          { number: 5, name: "Rotes Beet", description: "Apfel, Rote Beete, Ingwer, Zitrone", price: "6,20 €", priceValue: 6.2 },
          { number: 6, name: "ACE", description: "Orange, Apfel, Karotte, Zitrone", price: "5,50 €", priceValue: 5.5 },
          { number: 7, name: "Detox", description: "Orange, Apfel, Karotte, Ingwer", price: "5,70 €", priceValue: 5.7 },
          { number: 8, name: "Grüner Vital", description: "Spinat, Apfel, Minze, Limetten, Mango", price: "6,50 €", priceValue: 6.5 },
          { number: 9, name: "Açaí Berry", description: "Erdbeeren, Blaubeeren, Mango, Açaí", price: "6,80 €", priceValue: 6.8 },
          { number: 10, name: "Sommerliebe", description: "Pfirsich, Passionsfrucht, Mango, Apfel", price: "6,70 €", priceValue: 6.7 },
          { number: 11, name: "Pink Pitaya", description: "Drachenfrucht, Mango, Banane, Passionsfrucht, Apfel", price: "6,80 €", priceValue: 6.8 },
        ],
      },
      {
        title: "Brioche",
        items: [
          { number: 1, name: "Eggdrop Classic", description: "Brioche, Rührei, Cheddar, hausgemachte Sauce", price: "10,90 €", priceValue: 10.9 },
          { number: 2, name: "Mushroomdrop", description: "Brioche, Rührei, Cheddar, Champignons, Parmesan, hausgemachte Sauce", price: "12,90 €", priceValue: 12.9 },
          { number: 3, name: "Greendrop", description: "Brioche, Rührei, Cheddar, Avocado, Limettensaft, hausgemachte Sauce", price: "11,90 €", priceValue: 11.9 },
          { number: 4, name: "Chickendrop", description: "Brioche, Crispy Chicken, Cheddar, Tomate, Rucola, hausgemachte Sauce", price: "13,90 €", priceValue: 13.9 },
        ],
        extras: "Extras: Sucuk +3,50 € | Räucherlachs +5,00 €",
      },
      {
        title: "Bagels",
        items: [
          { number: 5, name: "Bagel Italia", description: "Tomate, Mozzarella, Rucola, Basilikumpesto, Balsamico", price: "7,90 €", priceValue: 7.9 },
          { number: 6, name: "Bagel mit Grillgemüse", description: "Gegrillte Aubergine, Paprika und Zucchini, Rucola, vegane Aioli", price: "8,90 €", priceValue: 8.9 },
        ],
      },
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
    sections: [
      {
        title: "Eggs, Bread & Love",
        items: [
          {
            name: "Scrambled Eggs on Sourdough",
            description: "Scrambled organic free-range eggs served on sourdough bread, with a choice of butter or tomato pesto.",
            price: "€11.50",
            priceValue: 11.5,
          },
          {
            name: "Avocado on Sourdough",
            description: "Sourdough bread topped with homemade avocado cream, beetroot hummus, and rocket.",
            price: "€12.90",
            priceValue: 12.9,
            extras: "Extras: Scrambled eggs +€5 | Mushrooms +€3.50 | Feta +€3 | Avocado +€3 | Smoked salmon +€5",
          },
          {
            name: "Eggs Benedict",
            description: "Poached eggs on sourdough bread with homemade avocado cream, smoked salmon, rocket, and hollandaise sauce.",
            price: "€16.90",
            priceValue: 16.9,
          },
          {
            name: "Shakshuka",
            description: "Two organic free-range eggs cooked in a fragrant tomato and pepper sauce with baby spinach and feta, served with two slices of crispy toasted sourdough bread.",
            price: "€13.90",
            priceValue: 13.9,
          },
          {
            name: "Oriental Breakfast",
            description: "Scrambled organic free-range eggs served with bread, Turkish sucuk sausage, cucumber, tomato, olives, white brined cheese, honey with cream cheese, and aubergine cream.",
            price: "€15.90",
            priceValue: 15.9,
          },
          {
            name: "Turkish Eggs",
            description: "Poached eggs served over creamy garlic yoghurt, topped with spiced paprika butter, and accompanied by two slices of crispy toasted sourdough bread.",
            price: "€14.90",
            priceValue: 14.9,
          },
        ],
      },
      {
        title: "Bagels",
        items: [
          {
            number: 1,
            name: "Salmon Bagel",
            description: "Cream cheese, smoked salmon, honey mustard sauce, fresh dill & rocket",
            price: "€9.50",
            priceValue: 9.5,
          },
          {
            number: 2,
            name: "Chicken Bagel",
            description: "Crispy chicken, cheddar cheese, tomato pesto & lettuce",
            price: "€8.90",
            priceValue: 8.9,
          },
          {
            number: 3,
            name: "Avocado Bagel",
            description: "Scrambled eggs, creamy avocado, vegan aioli, rocket & a hint of lime juice",
            price: "€9.50",
            priceValue: 9.5,
          },
          {
            number: 4,
            name: "Classic Bagel",
            description: "Cream cheese & tomato",
            price: "€6.50",
            priceValue: 6.5,
          },
        ],
      },
      {
        title: "Bowls",
        items: [
          {
            number: 5,
            name: "Chicken Bowl",
            description: "Couscous, chicken, feta cheese, cherry tomatoes, cucumber, beetroot, mixed greens & homemade sauce",
            price: "€13.90",
            priceValue: 13.9,
          },
          {
            number: 6,
            name: "Mediterranean Bowl",
            description: "Couscous, grilled vegetables, feta cheese, cherry tomatoes, cucumber, avocado, mixed greens & homemade sauce",
            price: "€12.90",
            priceValue: 12.9,
          },
          {
            number: 7,
            name: "Salmon Bowl",
            description: "Couscous, smoked salmon, cherry tomatoes, cucumber, avocado, rocket & honey mustard dressing",
            price: "€14.90",
            priceValue: 14.9,
          },
        ],
      },
      {
        title: "Sweet Treats Made with Love",
        items: [
          {
            number: 1,
            name: "Pancakes",
            description: "Pancakes served with pure maple syrup, powdered sugar & a selection of fresh fruits",
            price: "€10.50",
            priceValue: 10.5,
          },
          {
            number: 2,
            name: "Belgian Waffles",
            description: "Freshly baked waffle topped with powdered sugar & fresh fruits",
            price: "€10.50",
            priceValue: 10.5,
          },
          {
            number: 3,
            name: "Açaí Bowl",
            description: "Açaí topped with a selection of fresh fruits, granola, shredded coconut & chia seeds",
            price: "€11.50",
            priceValue: 11.5,
          },
          {
            number: 4,
            name: "Yogurt Bowl",
            description: "Greek yogurt with honey, fresh fruits, granola, chia seeds & shredded coconut",
            price: "€9.50",
            priceValue: 9.5,
          },
        ],
        extras: "Extras: Pistachio cream +€3.50 | Chocolate +€2.50 | Peanut butter +€3.00",
      },
      {
        title: "Iced Matcha Latte",
        items: [
          { number: 5, name: "Iced Matcha Latte", price: "€5.80", priceValue: 5.8 },
          { number: 6, name: "Strawberry Iced Matcha", price: "€6.40", priceValue: 6.4 },
          { number: 7, name: "Mango Iced Matcha", price: "€6.40", priceValue: 6.4 },
          { number: 8, name: "Cherry Vanilla Iced Matcha", price: "€6.70", priceValue: 6.7 },
        ],
        extras: "Extras: Syrup +€0.50 | Oat milk +€0.40 | Coconut milk +€0.50",
      },
      {
        title: "Fresh Lemonades",
        items: [
          { number: 1, name: "Lime & Mint", description: "Fresh mint and lime", price: "€5.50", priceValue: 5.5 },
          { number: 2, name: "Mixed Berry", description: "Fresh berries, lemon and mint", price: "€5.50", priceValue: 5.5 },
          { number: 3, name: "Coconut & Blueberry", description: "Fresh blueberries and coconut", price: "€5.50", priceValue: 5.5 },
        ],
      },
      {
        title: "Juices",
        items: [
          { number: 4, name: "Fresh Orange Juice", description: "Freshly squeezed oranges", price: "€5.50", priceValue: 5.5 },
          { number: 5, name: "Red Beet", description: "Apple, beetroot, ginger and lemon", price: "€6.20", priceValue: 6.2 },
          { number: 6, name: "ACE", description: "Orange, apple, carrot and lemon", price: "€5.50", priceValue: 5.5 },
          { number: 7, name: "Detox", description: "Orange, apple, carrot and ginger", price: "€5.70", priceValue: 5.7 },
          { number: 8, name: "Green Vitality", description: "Spinach, apple, mint, lime and mango", price: "€6.50", priceValue: 6.5 },
          { number: 9, name: "Açaí Berry", description: "Strawberries, blueberries, mango and açaí", price: "€6.80", priceValue: 6.8 },
          { number: 10, name: "Summer Love", description: "Peach, passion fruit, mango and apple", price: "€6.70", priceValue: 6.7 },
          { number: 11, name: "Pink Pitaya", description: "Dragon fruit, mango, banana, passion fruit and apple", price: "€6.80", priceValue: 6.8 },
        ],
      },
      {
        title: "Brioche",
        items: [
          { number: 1, name: "Eggdrop Classic", description: "Brioche bread, scrambled eggs, cheddar cheese & homemade sauce", price: "€10.90", priceValue: 10.9 },
          { number: 2, name: "Mushroomdrop", description: "Brioche bread, scrambled eggs, cheddar cheese, mushrooms, Parmesan & homemade sauce", price: "€12.90", priceValue: 12.9 },
          { number: 3, name: "Greendrop", description: "Brioche bread, scrambled eggs, cheddar cheese, avocado, lime juice & homemade sauce", price: "€11.90", priceValue: 11.9 },
          { number: 4, name: "Chickendrop", description: "Brioche bread, crispy chicken, cheddar cheese, tomato, rocket & homemade sauce", price: "€13.90", priceValue: 13.9 },
        ],
        extras: "Extras: Sucuk (Turkish sausage) +€3.50 | Smoked salmon +€5.00",
      },
      {
        title: "Bagels",
        items: [
          { number: 5, name: "Italian Bagel", description: "Tomato, mozzarella, rocket, basil pesto & balsamic vinegar", price: "€7.90", priceValue: 7.9 },
          { number: 6, name: "Grilled Vegetable Bagel", description: "Grilled aubergine, bell peppers, zucchini, rocket & vegan aioli", price: "€8.90", priceValue: 8.9 },
        ],
      },
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
