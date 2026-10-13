export type LocalReview = {
  quote: string;
  name: string;
  rating: number | null;
  approvalStatus: string;
};

// Keep the supplied excerpts and their translations marked for approval until republishing permission is confirmed.
export const localReviews: Record<"de" | "en", [LocalReview, LocalReview, LocalReview]> = {
  de: [
    { quote: "Ein wunderschönes Café mitten in der Altstadt von Lübeck.", name: "Dein Yoga", rating: null, approvalStatus: "Freigabe ausstehend" },
    { quote: "The best strawberry matcha I’ve ever had", name: "lunar", rating: null, approvalStatus: "Freigabe ausstehend" },
    { quote: "Leckeres Essen und schönes Ambiente mitten in der Stadt.", name: "Florian Bayram", rating: null, approvalStatus: "Freigabe ausstehend" },
  ],
  en: [
    { quote: "A beautiful café right in the heart of Lübeck’s Old Town.", name: "Dein Yoga", rating: null, approvalStatus: "Pending approval" },
    { quote: "The best strawberry matcha I’ve ever had", name: "lunar", rating: null, approvalStatus: "Pending approval" },
    { quote: "Delicious food and a lovely atmosphere right in the city center.", name: "Florian Bayram", rating: null, approvalStatus: "Pending approval" },
  ],
};
