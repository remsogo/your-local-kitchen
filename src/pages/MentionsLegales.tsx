import { restaurantInfo } from "@/data/menuData";

const MentionsLegales = () => (
  <div className="min-h-screen pt-32 pb-16">
    <div className="container mx-auto px-4 max-w-2xl">
      <h1 className="font-display text-5xl text-gradient text-center mb-12">Mentions LÃ©gales</h1>

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Ã‰diteur du site</h2>
          <p>{restaurantInfo.name}</p>
          <p>{restaurantInfo.address}</p>
          <p>{restaurantInfo.city}</p>
          <p>Site web : {restaurantInfo.website}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">HÃ©bergement</h2>
          <p>Ce site est hÃ©bergÃ© par notre fournisseur d'hÃ©bergement web.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">PropriÃ©tÃ© intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos) est la propriÃ©tÃ© exclusive de {restaurantInfo.name} et est protÃ©gÃ© par les lois franÃ§aises relatives Ã  la propriÃ©tÃ© intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">DonnÃ©es personnelles</h2>
          <p>
            Aucune donnÃ©e personnelle n'est collectÃ©e sur ce site sans votre consentement. ConformÃ©ment au RGPD, vous disposez d'un droit d'accÃ¨s, de rectification et de suppression de vos donnÃ©es.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Cookies</h2>
          <p>
            Ce site peut utiliser des cookies Ã  des fins de statistiques et d'amÃ©lioration de l'expÃ©rience utilisateur.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default MentionsLegales;

