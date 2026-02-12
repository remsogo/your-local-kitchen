import { useState } from "react";
import { menuData } from "@/data/menuData";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-5xl sm:text-6xl text-gradient text-center mb-8">Notre Menu</h1>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 sticky top-16 z-40 bg-background/90 backdrop-blur-md py-4">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                document.getElementById(cat.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/20"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Menu sections */}
        <div className="max-w-4xl mx-auto space-y-16">
          {menuData.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-32">
              <h2 className="font-display text-4xl text-gradient mb-2">{category.title}</h2>
              {category.subtitle && (
                <p className="text-sm text-muted-foreground mb-6">{category.subtitle}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-card rounded-xl p-4 hover:card-glow transition-shadow border border-border/50"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                      <div className="flex gap-2 shrink-0">
                        {item.prices.map((p) => (
                          <span
                            key={p.label + p.price}
                            className="bg-price text-price-foreground text-xs font-bold px-2 py-1 rounded"
                          >
                            {p.label ? `${p.label} ` : ""}{p.price}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
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
