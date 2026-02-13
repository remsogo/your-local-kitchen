import { useState } from "react";
import { useMenu } from "@/hooks/useMenu";

const Menu = () => {
  const { menu, loading } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Set initial active category when menu loads
  const activeCat = activeCategory || menu[0]?.id || "";

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
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="relative min-h-[150px] p-4 pt-14 sm:min-h-[165px] sm:pt-16">
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
                      <h3 className="mt-2 text-center font-semibold text-foreground text-lg leading-tight sm:mt-4">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
