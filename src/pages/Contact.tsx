import { FormEvent, useEffect, useMemo, useState } from "react";
import { MapPin, Clock, Phone, Globe, Send, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { restaurantInfo, deliveryHours } from "@/data/menuData";
import { trackAnalyticsEvent } from "@/lib/analyticsEvents";
import { getLocaleFromPathname } from "@/lib/i18n";
import { getBusinessStatus } from "@/lib/businessStatus";
import DeliveryCoverageMap from "@/components/DeliveryCoverageMap";

const phoneNumbers = [restaurantInfo.phone, restaurantInfo.secondaryPhone ?? ""]
  .map((n) => n.trim())
  .filter(Boolean);

type ContactFormState = {
  name: string;
  phone: string;
  message: string;
  consent: boolean;
};

const Contact = () => {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const [status, setStatus] = useState(() => getBusinessStatus(locale));
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    phone: "",
    message: "",
    consent: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formInfo, setFormInfo] = useState<string | null>(null);

  useEffect(() => {
    setStatus(getBusinessStatus(locale));
    const interval = window.setInterval(() => setStatus(getBusinessStatus(locale)), 60_000);
    return () => window.clearInterval(interval);
  }, [locale]);

  const labels = useMemo(
    () =>
      locale === "fr"
        ? {
            title: "Contact",
            intro: "Appelez-nous directement pour commander, demander une info ou nous trouver.",
            findUs: "Nous trouver",
            status: "Etat",
            delivery: "Livraison",
            orderByPhone: "Commander",
            deliveryText: "Nous livrons dans toutes les villes a 20 km ou moins de Sonchamp.",
            deliveryHoursLabel: "Horaires de livraison",
            deliveryFeeLabel: "Frais de livraison",
            contactFormTitle: "Formulaire de contact (RGPD)",
            contactFormIntro:
              "Ce formulaire n'enregistre rien en base: il prepare simplement votre message via votre application email.",
            name: "Nom",
            phone: "Telephone",
            message: "Message",
            consent:
              "J'accepte que les informations saisies soient utilisees uniquement pour me recontacter au sujet de ma demande.",
            submit: "Envoyer via email",
            formErrorConsent: "Le consentement est obligatoire pour envoyer le formulaire.",
            formErrorMessage: "Merci d'indiquer au minimum votre message.",
            formSuccess: "Ouverture de votre application email...",
            website: "Site web",
          }
        : {
            title: "Contact",
            intro: "Call us directly to order, ask for details or find us.",
            findUs: "Find us",
            status: "Status",
            delivery: "Delivery",
            orderByPhone: "Order",
            deliveryText: "We deliver in all towns within 20 km from Sonchamp.",
            deliveryHoursLabel: "Delivery hours",
            deliveryFeeLabel: "Delivery fee",
            contactFormTitle: "Contact form (GDPR)",
            contactFormIntro:
              "This form does not store anything in a database: it only prepares your message in your email app.",
            name: "Name",
            phone: "Phone",
            message: "Message",
            consent:
              "I agree that the provided information is used only to contact me back about my request.",
            submit: "Send by email",
            formErrorConsent: "Consent is required before sending.",
            formErrorMessage: "Please provide at least your message.",
            formSuccess: "Opening your email application...",
            website: "Website",
          },
    [locale],
  );

  const trackClick = (target: string) => {
    trackAnalyticsEvent({
      event_type: "click",
      page_path: location.pathname,
      target,
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setFormInfo(null);

    if (!form.consent) {
      setFormError(labels.formErrorConsent);
      return;
    }
    if (!form.message.trim()) {
      setFormError(labels.formErrorMessage);
      return;
    }

    const subject = encodeURIComponent(`[Site ${restaurantInfo.name}] Message client`);
    const body = encodeURIComponent(
      [
        `${labels.name}: ${form.name || "-"}`,
        `${labels.phone}: ${form.phone || "-"}`,
        "",
        `${labels.message}:`,
        form.message.trim(),
      ].join("\n"),
    );
    const mailto = `mailto:contact@${restaurantInfo.website}?subject=${subject}&body=${body}`;

    trackAnalyticsEvent({
      event_type: "click",
      page_path: location.pathname,
      target: "cta.contact.form_mailto",
    });
    setFormInfo(labels.formSuccess);
    window.location.href = mailto;
  };

  const statusClass = status.isOpen ? "border-green-400/45 bg-green-500/12 text-green-300" : "border-red-400/45 bg-red-500/12 text-red-300";

  return (
    <div className="min-h-screen pb-16 pt-32">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-3 text-center font-display text-5xl text-gradient sm:text-6xl">{labels.title}</h1>
        <p className="mb-10 text-center text-body-muted">{labels.intro}</p>

        <div className="space-y-6">
          <section className="section-shell rounded-xl p-6" aria-labelledby="contact-find-us-title">
            <h2 id="contact-find-us-title" className="font-display text-3xl text-foreground mb-4">
              {labels.findUs}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-body-muted">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>
                  {restaurantInfo.address}, {restaurantInfo.city}
                </span>
              </div>
              <div className="flex items-center gap-3 text-body-muted">
                <Clock size={18} className="text-primary shrink-0" />
                <span>10:30-14:30 / 18:00-22:00 (7/7)</span>
              </div>
              <div className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${statusClass}`}>
                {labels.status}: {status.label} - {status.detail}
              </div>
              {phoneNumbers.map((phone) => (
                <div key={phone} className="flex items-center gap-3 text-body-muted">
                  <Phone size={18} className="text-primary shrink-0" />
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    onClick={() => trackClick(`cta.contact.call:${phone}`)}
                    className="focus-ring rounded-sm font-medium transition-colors hover:text-primary"
                  >
                    {phone}
                  </a>
                </div>
              ))}
              <div className="flex items-center gap-3 text-body-muted">
                <Globe size={18} className="text-primary shrink-0" />
                <a
                  href={`https://${restaurantInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("cta.contact.open_website")}
                  className="focus-ring rounded-sm transition-colors hover:text-primary"
                >
                  {labels.website}: {restaurantInfo.website}
                </a>
              </div>
            </div>
          </section>

          <DeliveryCoverageMap locale={locale} />

          <section className="section-shell rounded-xl p-6" aria-labelledby="contact-delivery-title">
            <h2 id="contact-delivery-title" className="font-display text-3xl text-foreground mb-4">
              {labels.delivery}
            </h2>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {phoneNumbers.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  onClick={() => trackClick(`cta.contact.order_call:${phone}`)}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/55 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_12px_24px_-18px_hsl(30_100%_50%_/_0.95)] transition-all hover:-translate-y-0.5 hover:opacity-95 sm:w-auto"
                  aria-label={`${labels.orderByPhone} ${restaurantInfo.name}`}
                >
                  <Phone size={16} />
                  {labels.orderByPhone}: {phone}
                </a>
              ))}
            </div>
            <p className="text-body-muted">{labels.deliveryText}</p>
            <p className="text-body-muted mt-2">
              {labels.deliveryHoursLabel}: <span className="text-foreground font-semibold">{deliveryHours}</span>
            </p>
            <p className="text-body-muted mt-2">
              {labels.deliveryFeeLabel}: <span className="text-primary font-semibold">1,50 EUR a 3,50 EUR</span> -{" "}
              {locale === "fr"
                ? "minimum de commande de 20 EUR a 35 EUR selon la distance"
                : "minimum order between 20 EUR and 35 EUR depending on distance"}
              .
            </p>
          </section>

          <section className="section-shell rounded-xl p-6" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="font-display text-3xl text-foreground mb-2">
              {labels.contactFormTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{labels.contactFormIntro}</p>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-foreground">
                  {labels.name}
                </label>
                <input
                  id="contact-name"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="focus-ring w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-sm"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-foreground">
                  {labels.phone}
                </label>
                <input
                  id="contact-phone"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="focus-ring w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-sm"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-foreground">
                  {labels.message}
                </label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  rows={5}
                  className="focus-ring w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-sm"
                />
              </div>

              <label className="flex items-start gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => setForm((prev) => ({ ...prev, consent: event.target.checked }))}
                  className="mt-1"
                />
                <span>{labels.consent}</span>
              </label>

              {formError && <p className="text-sm text-destructive">{formError}</p>}
              {formInfo && <p className="text-sm text-green-400">{formInfo}</p>}

              <button
                type="submit"
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-primary/55 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
              >
                <Send size={16} />
                {labels.submit}
              </button>
            </form>

            <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              {locale === "fr"
                ? "Aucune donnee n'est stockee automatiquement via ce formulaire."
                : "No data is automatically stored through this form."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
