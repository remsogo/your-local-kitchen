import { CalendarDays, Megaphone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getLocaleFromPathname } from "@/lib/i18n";

type NewsPost = {
  id: string;
  date: string;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
};

const NEWS_POSTS: NewsPost[] = [
  {
    id: "promo-lun-jeu",
    date: "2026-02-16",
    titleFr: "Offre pizza Senior du lundi au jeudi",
    titleEn: "Senior pizza offer from Monday to Thursday",
    summaryFr: "1 pizza Senior achetee = la 2eme a -50% / 2 achetees = la 3eme offerte (a emporter).",
    summaryEn: "Buy 1 Senior pizza, get 50% off the second / buy 2, get the third free (takeaway only).",
  },
  {
    id: "zone-livraison",
    date: "2026-02-16",
    titleFr: "Livraison locale et verificateur d'adresse",
    titleEn: "Local delivery and address checker",
    summaryFr: "La page contact affiche la zone de 20 km et un estimateur de frais selon la distance.",
    summaryEn: "The contact page now includes a 20 km delivery map and a distance-based fee estimator.",
  },
];

const News = () => {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);

  return (
    <div className="min-h-screen pb-16 pt-32" data-testid="news-page">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-center font-display text-5xl text-gradient sm:text-6xl" data-testid="news-title">
          {locale === "fr" ? "Actualites" : "News"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-body-muted">
          {locale === "fr"
            ? "Mises a jour du snack, offres en cours et informations pratiques."
            : "Snack updates, current offers and practical info."}
        </p>

        <section className="mt-8 space-y-4" aria-label={locale === "fr" ? "Liste des actualites" : "News list"}>
          {NEWS_POSTS.map((post) => (
            <article key={post.id} className="section-shell rounded-2xl p-5 sm:p-6" data-testid={`news-item-${post.id}`}>
              <div className="flex items-center gap-2 text-primary">
                <Megaphone size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {locale === "fr" ? "Mise a jour" : "Update"}
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
                {locale === "fr" ? post.titleFr : post.titleEn}
              </h2>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={15} className="text-primary" />
                {post.date}
              </p>
              <p className="mt-3 text-body-muted">{locale === "fr" ? post.summaryFr : post.summaryEn}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default News;
