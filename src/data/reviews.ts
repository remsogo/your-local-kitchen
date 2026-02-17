export type HighlightReview = {
  id: string;
  author: string;
  rating: 4 | 5;
  city: string;
  commentFr: string;
  commentEn: string;
};

// Manual short excerpts inspired by customer feedback. Replace with approved quotes from your GBP profile.
export const highlightReviews: HighlightReview[] = [
  {
    id: "rvw-1",
    author: "Client local",
    rating: 5,
    city: "Sonchamp",
    commentFr: "Service rapide, pizzas genereuses et accueil top.",
    commentEn: "Fast service, generous pizzas and great welcome.",
  },
  {
    id: "rvw-2",
    author: "Client livraison",
    rating: 5,
    city: "Rambouillet",
    commentFr: "Commande claire par telephone, livraison efficace.",
    commentEn: "Easy phone order and efficient delivery.",
  },
  {
    id: "rvw-3",
    author: "Habitue",
    rating: 4,
    city: "Ablis",
    commentFr: "Bon rapport qualite-prix, equipe tres sympa.",
    commentEn: "Great value for money, very friendly team.",
  },
];
