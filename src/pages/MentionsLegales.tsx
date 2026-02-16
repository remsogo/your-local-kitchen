import { restaurantInfo } from "@/data/menuData";

const MentionsLegales = () => (
  <div className="min-h-screen pb-16 pt-32">
    <div className="container mx-auto px-4 max-w-2xl">
      <h1 className="mb-10 text-center font-display text-5xl text-gradient">Mentions legales</h1>

      <div className="section-shell space-y-8 rounded-2xl p-6 text-sm leading-6 text-muted-foreground sm:p-8">
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Editeur du site</h2>
          <p>{restaurantInfo.name}</p>
          <p>{restaurantInfo.address}</p>
          <p>{restaurantInfo.city}</p>
          <p>Site web : {restaurantInfo.website}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Hebergement</h2>
          <p>Ce site est heberge par notre fournisseur d'hebergement web.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Propriete intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos) est la propriete exclusive de {restaurantInfo.name} et est protege par les lois francaises relatives a la propriete intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Donnees personnelles</h2>
          <p>
            Aucune donnee personnelle n'est collectee sur ce site sans votre consentement. Conformement au RGPD, vous disposez d'un droit d'acces, de rectification et de suppression de vos donnees.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Cookies</h2>
          <p>
            Ce site peut utiliser des cookies a des fins de statistiques et d'amelioration de l'experience utilisateur.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default MentionsLegales;
