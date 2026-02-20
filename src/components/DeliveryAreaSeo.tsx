import { featuredDeliveryCommunes } from "@/data/serviceAreas";
import { DELIVERY_MAX_KM } from "@/lib/delivery";
import { Locale } from "@/lib/i18n";

type DeliveryAreaSeoProps = {
  locale: Locale;
};

const DeliveryAreaSeo = ({ locale }: DeliveryAreaSeoProps) => (
  <section className="section-shell mx-auto mt-8 max-w-5xl rounded-2xl p-5 sm:p-7" aria-labelledby="delivery-area-seo-title">
    <h2 id="delivery-area-seo-title" className="font-display text-3xl text-gradient sm:text-4xl">
      {locale === "fr"
        ? `Villes et villages autour de Sonchamp (${DELIVERY_MAX_KM} km)`
        : `Towns and villages around Sonchamp (${DELIVERY_MAX_KM} km)`}
    </h2>
    <p className="mt-3 text-body-muted">
      {locale === "fr"
        ? `Vous cherchez un snack, kebab, pizza ou restaurant autour de Sonchamp ? Pizz'Atiq couvre la zone locale dans un rayon de ${DELIVERY_MAX_KM} km selon secteur de livraison.`
        : `Looking for snack food, kebab, pizza or a restaurant around Sonchamp? Pizz'Atiq covers the local area within a ${DELIVERY_MAX_KM} km radius depending on delivery zone.`}
    </p>
    <p className="mt-3 text-body-muted">
      {locale === "fr" ? "Communes principales" : "Main delivery towns"}: {featuredDeliveryCommunes.join(", ")}.
    </p>
  </section>
);

export default DeliveryAreaSeo;
