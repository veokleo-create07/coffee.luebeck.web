export type LocalReview = {
  quote: string;
  name: string;
  rating: number | null;
  approvalStatus: string;
};

// Keep excerpts unchanged until republishing permission is confirmed.
export const localReviews: Record<"de" | "en", [LocalReview, LocalReview, LocalReview]> = {
  de: [
    { quote: "Ein wunderschönes Café mitten in der Altstadt von Lübeck.", name: "Dein Yoga", rating: null, approvalStatus: "Freigabe ausstehend" },
    { quote: "The best strawberry matcha I’ve ever had", name: "lunar", rating: null, approvalStatus: "Freigabe ausstehend" },
    { quote: "Leckeres Essen und schönes Ambiente mitten in der Stadt.", name: "Florian Bayram", rating: null, approvalStatus: "Freigabe ausstehend" },
  ],
  en: [
    { quote: "Ein wunderschönes Café mitten in der Altstadt von Lübeck.", name: "Dein Yoga", rating: null, approvalStatus: "Pending approval" },
    { quote: "The best strawberry matcha I’ve ever had", name: "lunar", rating: null, approvalStatus: "Pending approval" },
    { quote: "Leckeres Essen und schönes Ambiente mitten in der Stadt.", name: "Florian Bayram", rating: null, approvalStatus: "Pending approval" },
  ],
};
