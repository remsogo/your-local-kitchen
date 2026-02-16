import { deliveryCommunes20km, featuredDeliveryCommunes } from "@/data/serviceAreas";

const DeliveryAreaSeo = () => (
  <section className="section-shell mx-auto mt-8 max-w-5xl rounded-2xl p-5 sm:p-7" aria-labelledby="delivery-area-seo-title">
    <h2 id="delivery-area-seo-title" className="font-display text-3xl text-gradient sm:text-4xl">
      Villes et villages autour de Sonchamp (20 km)
    </h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">
      Vous cherchez un snack, kebab, pizza ou restaurant autour de Sonchamp ? Pizz&apos;Atiq couvre la zone locale
      dans un rayon de 20 km selon secteur de livraison.
    </p>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">
      Communes principales: {featuredDeliveryCommunes.join(", ")}.
    </p>

    <details className="mt-4 rounded-xl border border-white/10 bg-card/45 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-foreground">
        Voir la liste complete des communes ({deliveryCommunes20km.length})
      </summary>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {deliveryCommunes20km.map((commune) => (
          <span
            key={commune}
            className="rounded-md border border-border/60 bg-background/60 px-2 py-1 text-xs text-muted-foreground"
          >
            {commune}
          </span>
        ))}
      </div>
    </details>
  </section>
);

export default DeliveryAreaSeo;
