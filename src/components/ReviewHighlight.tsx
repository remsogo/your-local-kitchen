import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { highlightReviews } from "@/data/reviews";
import { Locale } from "@/lib/i18n";

type ReviewHighlightProps = {
  locale: Locale;
};

const ReviewHighlight = ({ locale }: ReviewHighlightProps) => {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    // Keep one random review per session to avoid layout jumps at every render.
    const storageKey = "review_highlight_index";
    const existing = window.sessionStorage.getItem(storageKey);
    if (existing) {
      const parsed = Number(existing);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < highlightReviews.length) {
        setReviewIndex(parsed);
        setSeeded(true);
        return;
      }
    }
    const next = Math.floor(Math.random() * highlightReviews.length);
    window.sessionStorage.setItem(storageKey, String(next));
    setReviewIndex(next);
    setSeeded(true);
  }, []);

  const review = useMemo(() => highlightReviews[reviewIndex] || highlightReviews[0], [reviewIndex]);
  if (!seeded || !review) return null;

  return (
    <section className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/12 bg-card/55 p-4 backdrop-blur-sm" aria-label="Avis clients">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {locale === "fr" ? "Avis clients (apercu)" : "Customer reviews (snapshot)"}
      </p>
      <div className="mt-2 flex items-center gap-1 text-primary">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={`${review.id}-${index}`} size={14} fill="currentColor" />
        ))}
      </div>
      <p className="mt-3 text-sm text-foreground">{locale === "fr" ? review.commentFr : review.commentEn}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {review.author} - {review.city}
      </p>
    </section>
  );
};

export default ReviewHighlight;
