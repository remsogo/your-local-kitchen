import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { highlightReviews } from "@/data/reviews";
import { Locale } from "@/lib/i18n";
import { getSessionRandomIndex } from "@/lib/reviewUtils";

type ReviewHighlightProps = {
  locale: Locale;
};

const ReviewHighlight = ({ locale }: ReviewHighlightProps) => {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [seeded, setSeeded] = useState(false);
  const storageKey = "review_highlight_index";

  useEffect(() => {
    // Keep one random review per session to avoid layout jumps.
    const next = getSessionRandomIndex(window.sessionStorage, storageKey, highlightReviews.length);
    setReviewIndex(next);
    setSeeded(true);
  }, []);

  const review = useMemo(() => {
    return highlightReviews[reviewIndex] || highlightReviews[0] || null;
  }, [reviewIndex]);

  const showAnotherReview = () => {
    if (highlightReviews.length <= 1) return;

    let next = Math.floor(Math.random() * highlightReviews.length);
    if (next === reviewIndex) {
      next = (next + 1) % highlightReviews.length;
    }

    window.sessionStorage.setItem(storageKey, String(next));
    setReviewIndex(next);
  };

  if (!seeded || !review) return null;

  return (
    <section
      className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/12 bg-card/55 p-4 backdrop-blur-sm"
      aria-label={locale === "fr" ? "Avis clients" : "Customer reviews"}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {locale === "fr" ? "Avis clients Google (selection)" : "Google customer reviews (selection)"}
      </p>
      <div className="mt-2 flex items-center gap-1 text-primary">
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={`${review.id}-${index}`} size={14} fill="currentColor" />
        ))}
      </div>
      <p className="mt-3 text-sm text-foreground">{locale === "fr" ? review.commentFr : review.commentEn}</p>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          {review.author} - {review.city}
        </span>
        <button
          type="button"
          onClick={showAnotherReview}
          className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
        >
          {locale === "fr" ? "Voir un autre avis" : "Show another review"}
        </button>
      </div>
    </section>
  );
};

export default ReviewHighlight;
