export type HighlightReview = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  city: string;
  commentFr: string;
  commentEn: string;
};

// Static review excerpts manually sourced from user-provided screenshots.
export const highlightReviews: HighlightReview[] = [
  {
    id: "rvw-1",
    author: "Eric Paris",
    rating: 5,
    city: "Sonchamp",
    commentFr:
      "Un tres bon accueil, le patron est toujours souriant et tres commercant. Les produits sont de tres bonne qualite. Merci beaucoup.",
    commentEn:
      "Very warm welcome, always smiling service, and great product quality. Thank you.",
  },
  {
    id: "rvw-2",
    author: "Narges Jafari",
    rating: 5,
    city: "Sonchamp",
    commentFr:
      "Un excellent restaurant. Les pizzas sont delicieuses, bien garnies et cuites a la perfection. Les burgers sont savoureux, avec de bons ingredients et du pain moelleux.",
    commentEn:
      "Excellent restaurant with delicious pizzas and tasty burgers made with good ingredients.",
  },
  {
    id: "rvw-3",
    author: "Amaury AUSSIERE",
    rating: 5,
    city: "Sonchamp",
    commentFr:
      "Au top. Ca fait plusieurs fois qu'on y va et jamais decu. Le service est top, la qualite est au rendez-vous et le chef est super.",
    commentEn:
      "Always great: top service, strong quality, and a great chef.",
  },
  {
    id: "rvw-4",
    author: "Remi M.",
    rating: 5,
    city: "Sonchamp",
    commentFr:
      "Top. Meilleure pizzeria du secteur, service nickel, petits gateaux offerts de temps en temps.",
    commentEn:
      "Top place, best pizzeria in the area with excellent service and nice extras.",
  },
  {
    id: "rvw-5",
    author: "Aude Damex",
    rating: 5,
    city: "Sonchamp",
    commentFr: "Tres bel accueil, les kebabs etaient tres bons. Merci beaucoup.",
    commentEn: "Very warm welcome and very good kebabs. Thank you.",
  },
  {
    id: "rvw-6",
    author: "Christophe Bodennec",
    rating: 5,
    city: "Sonchamp",
    commentFr: "Tres bonne experience, tres bon accueil du chef et tres bons produits.",
    commentEn: "Very good experience, warm welcome from the chef, and great products.",
  },
  {
    id: "rvw-7",
    author: "Magali Duez",
    rating: 5,
    city: "Sonchamp",
    commentFr: "La nourriture est tres bonne et l'accueil est extra.",
    commentEn: "Food is very good and the welcome is excellent.",
  },
  {
    id: "rvw-8",
    author: "Arthur Bouquet",
    rating: 5,
    city: "Sonchamp",
    commentFr: "Ils sont extremement bons et gentils, ils meritent plus de clients.",
    commentEn: "Excellent food and very kind team; they deserve more customers.",
  },
  {
    id: "rvw-9",
    author: "Eren Jager",
    rating: 5,
    city: "Sonchamp",
    commentFr:
      "Toujours un plaisir de venir, un regal a chaque fois. Surement le meilleur rapport qualite-prix que je connaisse.",
    commentEn:
      "Always a pleasure to come here, consistently delicious, and great value for money.",
  },
  {
    id: "rvw-10",
    author: "Angelina Foret",
    rating: 5,
    city: "Sonchamp",
    commentFr: "Je suis une habituee et je me regale a chaque fois. Toujours delicieux.",
    commentEn: "I am a regular and enjoy it every time. Always delicious.",
  },
  {
    id: "rvw-11",
    author: "Thomas Griffart",
    rating: 5,
    city: "Sonchamp",
    commentFr:
      "Tres bonne adresse. Les patrons sont adorables, toujours avec le sourire. Les prix sont corrects et la viande est bonne.",
    commentEn:
      "Great address, lovely owners, fair prices, and good meat quality.",
  },
  {
    id: "rvw-12",
    author: "Catherine Derou",
    rating: 5,
    city: "Sonchamp",
    commentFr:
      "Nous avons ete tres bien accueillis. Burgers, sandwiches et tacos excellents. Le poulet chika est une merveille.",
    commentEn:
      "Very warm welcome, excellent burgers/sandwiches/tacos, and outstanding chicken chika.",
  },
  {
    id: "rvw-13",
    author: "Axel Bruyere",
    rating: 5,
    city: "Sonchamp",
    commentFr: "Tres bien accueilli et on y mange bien.",
    commentEn: "Very warm welcome and very good food.",
  },
];
