import { useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";
import { legalInfo } from "@/data/legalInfo";
import { getLocaleFromPathname } from "@/lib/i18n";

const MentionsLegales = () => {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const isFrench = locale === "fr";
  const legalValuesToCheck = [legalInfo.siret, legalInfo.publicationDirector, legalInfo.privacyContact, legalInfo.vatNumber];
  const hasMissingLegalData = legalValuesToCheck.some((value) => value.includes("A RENSEIGNER"));

  return (
    <div className="min-h-screen pb-16 pt-32" data-testid="legal-page">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center font-display text-5xl text-gradient sm:text-6xl" data-testid="legal-title">
          {isFrench ? "Mentions legales" : "Legal notice"}
        </h1>

        {hasMissingLegalData && (
          <aside className="mb-6 rounded-xl border border-amber-400/45 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p className="inline-flex items-center gap-2 font-semibold">
              <AlertTriangle size={16} />
              {isFrench
                ? "Certaines donnees legales sont marquees A RENSEIGNER."
                : "Some legal values are marked TO BE COMPLETED."}
            </p>
            <p className="mt-2">
              {isFrench
                ? "Mettez a jour `src/data/legalInfo.ts` avant une exploitation definitive."
                : "Update `src/data/legalInfo.ts` before final production use."}
            </p>
          </aside>
        )}

        <div className="section-shell space-y-8 rounded-2xl p-6 text-sm leading-7 text-muted-foreground sm:p-8">
          <section aria-labelledby="legal-publisher-title">
            <h2 id="legal-publisher-title" className="font-display text-3xl text-foreground mb-3">
              {isFrench ? "Editeur du site" : "Website publisher"}
            </h2>
            <p>{legalInfo.companyName}</p>
            <p>{legalInfo.legalForm}</p>
            <p>{restaurantInfo.address}</p>
            <p>{restaurantInfo.city}</p>
            <p>SIRET: {legalInfo.siret}</p>
            <p>{isFrench ? "Numero TVA intracommunautaire" : "VAT number"}: {legalInfo.vatNumber}</p>
            <p>
              {isFrench ? "Responsable de publication" : "Publication director"}: {legalInfo.publicationDirector}
            </p>
            <p>
              {isFrench ? "Contact publication" : "Publication contact"}: {legalInfo.publicationDirectorContact}
            </p>
            <p>
              {isFrench ? "Site web" : "Website"}: {restaurantInfo.website}
            </p>
          </section>

          <section aria-labelledby="legal-host-title">
            <h2 id="legal-host-title" className="font-display text-3xl text-foreground mb-3">
              {isFrench ? "Hebergement" : "Hosting"}
            </h2>
            <p>{legalInfo.hostName}</p>
            <p>{legalInfo.hostAddress}</p>
            <p>
              {isFrench ? "Site hebergeur" : "Host website"}:{" "}
              <a className="text-primary hover:underline" href={legalInfo.hostWebsite} rel="noopener noreferrer" target="_blank">
                {legalInfo.hostWebsite}
              </a>
            </p>
          </section>

          <section aria-labelledby="legal-ip-title">
            <h2 id="legal-ip-title" className="font-display text-3xl text-foreground mb-3">
              {isFrench ? "Propriete intellectuelle" : "Intellectual property"}
            </h2>
            <p>
              {isFrench
                ? `L'ensemble du contenu de ce site (textes, images, logos) est la propriete exclusive de ${restaurantInfo.name} et est protege par les lois francaises relatives a la propriete intellectuelle.`
                : `All content on this website (texts, images, logos) is the exclusive property of ${restaurantInfo.name} and is protected under intellectual property law.`}
            </p>
          </section>

          <section aria-labelledby="legal-privacy-title">
            <h2 id="legal-privacy-title" className="font-display text-3xl text-foreground mb-3">
              {isFrench ? "Donnees personnelles et RGPD" : "Personal data and GDPR"}
            </h2>
            <p>
              {isFrench
                ? "Le site collecte uniquement les informations strictement necessaires aux demandes clients (formulaire de contact par email). Aucune base de donnees marketing n'est constituee sans consentement explicite."
                : "The website only collects data strictly required for customer requests (email contact form). No marketing database is built without explicit consent."}
            </p>
            <p>
              {isFrench ? "Contact vie privee" : "Privacy contact"}: {legalInfo.privacyContact}
            </p>
            <p>
              {isFrench
                ? "Conformement au RGPD, vous pouvez demander l'acces, la rectification et la suppression de vos donnees."
                : "In accordance with GDPR, you may request access, correction and deletion of your data."}
            </p>
          </section>

          <section aria-labelledby="legal-cookies-title">
            <h2 id="legal-cookies-title" className="font-display text-3xl text-foreground mb-3">
              {isFrench ? "Cookies et mesure d'audience" : "Cookies and analytics"}
            </h2>
            <p>
              {isFrench
                ? "Le site utilise des cookies de mesure d'audience (Google Analytics) pour analyser la frequentation et ameliorer l'experience utilisateur."
                : "The website uses analytics cookies (Google Analytics) to measure traffic and improve user experience."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
