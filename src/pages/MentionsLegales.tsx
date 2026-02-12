import { restaurantInfo } from "@/data/menuData";

const MentionsLegales = () => (
  <div className="min-h-screen pt-20 pb-16">
    <div className="container mx-auto px-4 max-w-2xl">
      <h1 className="font-display text-5xl text-gradient text-center mb-12">Mentions Légales</h1>

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Éditeur du site</h2>
          <p>{restaurantInfo.name}</p>
          <p>{restaurantInfo.address}</p>
          <p>{restaurantInfo.city}</p>
          <p>Site web : {restaurantInfo.website}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Hébergement</h2>
          <p>Ce site est hébergé par Lovable.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de {restaurantInfo.name} et est protégé par les lois françaises relatives à la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Données personnelles</h2>
          <p>
            Aucune donnée personnelle n'est collectée sur ce site sans votre consentement. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Cookies</h2>
          <p>
            Ce site peut utiliser des cookies à des fins de statistiques et d'amélioration de l'expérience utilisateur.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default MentionsLegales;
