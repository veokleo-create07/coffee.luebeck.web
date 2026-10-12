export type LocalReview = {
  quote: string;
  name: string;
  rating: string;
  isPlaceholder: true;
};

// Replace these approval-safe placeholders with authentic, approved Google reviews.
export const localReviews: Record<"de" | "en", [LocalReview, LocalReview, LocalReview]> = {
  de: [
    { quote: "Authentische Kundenstimme folgt nach Freigabe.", name: "Name folgt", rating: "Bewertung folgt", isPlaceholder: true },
    { quote: "Authentische Kundenstimme folgt nach Freigabe.", name: "Name folgt", rating: "Bewertung folgt", isPlaceholder: true },
    { quote: "Authentische Kundenstimme folgt nach Freigabe.", name: "Name folgt", rating: "Bewertung folgt", isPlaceholder: true },
  ],
  en: [
    { quote: "Authentic customer comment pending approval.", name: "Name to come", rating: "Rating to come", isPlaceholder: true },
    { quote: "Authentic customer comment pending approval.", name: "Name to come", rating: "Rating to come", isPlaceholder: true },
    { quote: "Authentic customer comment pending approval.", name: "Name to come", rating: "Rating to come", isPlaceholder: true },
  ],
};
