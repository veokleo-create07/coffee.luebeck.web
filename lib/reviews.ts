export type LocalReview = {
  quote: string;
  name: string;
  rating: number | null;
  approvalStatus: string;
  approved: boolean;
};

// These supplied excerpts have been approved for display in the review section.
export const localReviews: Record<"de" | "en", [LocalReview, LocalReview, LocalReview]> = {
  de: [
    { quote: "Ein wunderschönes Café mitten in der Altstadt von Lübeck.", name: "Dein Yoga", rating: null, approvalStatus: "Freigegeben", approved: true },
    { quote: "The best strawberry matcha I’ve ever had", name: "lunar", rating: null, approvalStatus: "Freigegeben", approved: true },
    { quote: "Leckeres Essen und schönes Ambiente mitten in der Stadt.", name: "Florian Bayram", rating: null, approvalStatus: "Freigegeben", approved: true },
  ],
  en: [
    { quote: "A beautiful café right in the heart of Lübeck’s Old Town.", name: "Dein Yoga", rating: null, approvalStatus: "Approved", approved: true },
    { quote: "The best strawberry matcha I’ve ever had", name: "lunar", rating: null, approvalStatus: "Approved", approved: true },
    { quote: "Delicious food and a lovely atmosphere right in the city center.", name: "Florian Bayram", rating: null, approvalStatus: "Approved", approved: true },
  ],
};
