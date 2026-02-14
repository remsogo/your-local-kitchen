import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";

const Menu = () => {
  const { menu, loading } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string | null>(null);
  const sauces = ["Blanche", "Harissa", "Barbecue", "Algérienne", "Samouraï", "Ketchup", "Mayonnaise", "Andalouse"];

  // Set initial active category when menu loads
  const activeCat = activeCategory || menu[0]?.id || "";

  useEffect(() => {
    if (!zoomImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomImage(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomImage]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement du menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-5xl sm:text-6xl text-gradient text-center mb-8">Notre Menu</h1>
        <section aria-labelledby="menu-local-heading" className="mx-auto mb-8 max-w-3xl">
          <h2 id="menu-local-heading" className="sr-only">Menu local a Sonchamp</h2>
          <p className="text-center text-sm text-muted-foreground">
            Decouvrez nos pizzas, burgers, sandwichs et tacos prepares a Sonchamp, disponibles sur place, a emporter et en livraison.
          </p>
        </section>

        {/* Category tabs */}
        <nav aria-label="Categories du menu" className="mb-12 sticky top-28 z-30 bg-background/90 backdrop-blur-md py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {menu.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById(cat.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCat === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </nav>

        {/* Menu sections */}
        <div className="max-w-4xl mx-auto space-y-16">
          {menu.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-48" aria-labelledby={`${category.id}-title`}>
              <h2 id={`${category.id}-title`} className="font-display text-4xl text-gradient mb-2">{category.title}</h2>
              {category.subtitle && (
                <p className="text-sm text-muted-foreground mb-6">{category.subtitle}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list" aria-label={`Produits ${category.title}`}>
                {category.items.map((item) => (
                  <article
                    key={item.name}
                    role="listitem"
                    className="bg-card rounded-xl overflow-hidden hover:card-glow transition-shadow border border-border/50"
                  >
                    {item.imageUrl ? (
                      <button
                        type="button"
                        className="relative block w-full"
                        onClick={() => setZoomImage({ src: item.imageUrl!, alt: item.name })}
                        aria-label={`Agrandir la photo de ${item.name}`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-56 w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                        <div className="absolute top-3 right-3 left-3 flex flex-nowrap justify-end gap-1 overflow-x-auto">
                          {item.prices.map((p) => (
                            <span
                              key={p.label + p.price}
                              className="shrink-0 whitespace-nowrap rounded bg-price px-1.5 py-1 text-[11px] font-bold text-price-foreground sm:px-2 sm:text-xs"
                            >
                              {p.label ? `${p.label} ` : ""}{p.price}
                            </span>
                          ))}
                        </div>
                        <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/35 bg-background/55 px-3 py-2 text-left backdrop-blur-sm">
                          <h3 className="text-base font-semibold leading-tight text-foreground">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs text-foreground/85">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <h3 className="flex-1 text-lg font-semibold leading-tight text-foreground">
                            {item.name}
                          </h3>
                          <div className="flex max-w-[70%] flex-nowrap justify-end gap-1 overflow-x-auto">
                            {item.prices.map((p) => (
                              <span
                                key={p.label + p.price}
                                className="shrink-0 whitespace-nowrap rounded bg-price px-1.5 py-1 text-[11px] font-bold text-price-foreground sm:px-2 sm:text-xs"
                              >
                                {p.label ? `${p.label} ` : ""}{p.price}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-4xl" aria-labelledby="sauces-title">
          <h2 id="sauces-title" className="mb-2 font-display text-4xl text-gradient">Bar a sauces</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Choisissez votre sauce. Touchez une sauce pour la mettre en avant.
          </p>
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4">
            <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />
            <div className="relative flex flex-wrap gap-2">
              {sauces.map((sauce) => {
                const active = selectedSauce === sauce;
                return (
                  <button
                    key={sauce}
                    type="button"
                    onClick={() => setSelectedSauce(active ? null : sauce)}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "border-border/70 bg-background/60 text-foreground hover:border-primary/50 hover:bg-primary/10"
                    }`}
                    aria-pressed={active}
                  >
                    {sauce}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      {zoomImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoomImage(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-background/80 p-2 text-foreground"
            onClick={() => setZoomImage(null)}
            aria-label="Fermer l'image"
          >
            <X size={18} />
          </button>
          <img
            src={zoomImage.src}
            alt={zoomImage.alt}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Menu;
