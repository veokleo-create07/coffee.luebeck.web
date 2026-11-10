import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/dictionaries/de";
import type { Locale } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";

type PrivacyPolicyPageProps = { locale: Locale; dictionary: Dictionary };

function PolicySection({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section id={`privacy-section-${number}`} className="scroll-mt-10 py-8 first:pt-0 md:py-10" aria-labelledby={`privacy-heading-${number}`}>
      <h2 id={`privacy-heading-${number}`} className="text-[clamp(1.45rem,2.5vw,2rem)] font-semibold leading-[1.08] tracking-[-0.035em]">{title}</h2>
      <div className="privacy-copy mt-5 space-y-4 text-[0.9375rem] leading-[1.72] text-espresso-soft md:text-base md:leading-[1.75]">{children}</div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="break-words font-medium text-espresso underline decoration-espresso/25 underline-offset-4 transition-colors hover:decoration-espresso">{children}</a>;
}

function GermanPolicy({ dictionary }: { dictionary: Dictionary }) {
  return (
    <>
      <PolicySection number={1} title="Verantwortlicher">
        <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:</p>
        <address className="not-italic text-espresso">
          Altstadtliebe<br />
          Kubilay Kilic<br />
          Mühlenstraße 51<br />
          23552 Lübeck<br />
          Deutschland
        </address>
        <p>Telefon: <a className="font-medium text-espresso underline decoration-espresso/25 underline-offset-4" href={dictionary.location.phoneHref}>{dictionary.location.phoneLabel}</a></p>
      </PolicySection>

      <PolicySection number={2} title="Allgemeine Hinweise zum Datenschutz">
        <p>Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Wir verarbeiten Ihre Daten vertraulich und entsprechend der Datenschutz-Grundverordnung (DSGVO) sowie den geltenden deutschen Datenschutzvorschriften.</p>
        <p>Personenbezogene Daten sind Informationen, mit denen Sie persönlich identifiziert werden können.</p>
        <p>In dieser Datenschutzerklärung erläutern wir, welche Daten wir erheben, zu welchen Zwecken wir diese verwenden und welche Rechte Ihnen zustehen.</p>
      </PolicySection>

      <PolicySection number={3} title="Hosting durch Vercel">
        <p>Unsere Website wird über den Dienst Vercel bereitgestellt.</p>
        <p>Anbieter ist Vercel Inc., USA.</p>
        <p>Beim Besuch unserer Website können technisch erforderliche Informationen verarbeitet werden, insbesondere:</p>
        <ul><li>IP-Adresse</li><li>Datum und Uhrzeit des Zugriffs</li><li>Aufgerufene Seiten und Dateien</li><li>Browsertyp und Betriebssystem</li><li>Technische Anfrage- und Verbindungsinformationen</li></ul>
        <p>Diese Daten werden zur Bereitstellung der Website, zur Gewährleistung der Sicherheit und zur Erkennung technischer Störungen verarbeitet.</p>
        <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse besteht in einem sicheren und zuverlässigen Betrieb unserer Website.</p>
        <p>Im Rahmen der Bereitstellung der Hosting-Dienste kann es zu einer Verarbeitung personenbezogener Daten außerhalb der Europäischen Union kommen. Dabei sind die jeweils anwendbaren Datenschutzgarantien zu berücksichtigen.</p>
        <p>Weitere Informationen: <ExternalLink href="https://vercel.com/legal/privacy-policy">Vercel Privacy Policy</ExternalLink></p>
      </PolicySection>

      <PolicySection number={4} title="Online-Tischreservierungen">
        <p>Auf unserer Website können Sie einen Tisch in unserem Café reservieren.</p>
        <p>Hierfür verarbeiten wir folgende Angaben:</p>
        <ul><li>Vor- und Nachname</li><li>E-Mail-Adresse</li><li>Datum der Reservierung</li><li>Uhrzeit der Reservierung</li><li>Anzahl der Gäste</li><li>Freiwillige besondere Wünsche oder Mitteilungen</li></ul>
        <p>Wir verwenden diese Daten ausschließlich zur Bearbeitung, Organisation, Bestätigung und Verwaltung Ihrer Tischreservierung sowie zur damit verbundenen Kommunikation.</p>
        <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Durchführung vorvertraglicher Maßnahmen beziehungsweise zur Abwicklung Ihrer Reservierung.</p>
        <p>Die für die Reservierung erforderlichen Angaben sind notwendig, um Ihre Buchung bearbeiten zu können. Freiwillige Mitteilungen sind nicht erforderlich.</p>
        <p>Bitte übermitteln Sie im Feld für besondere Wünsche möglichst keine sensiblen personenbezogenen Informationen, insbesondere keine Gesundheitsdaten.</p>
      </PolicySection>

      <PolicySection number={5} title="Datenbank und Speicherung durch Supabase">
        <p>Zur sicheren Speicherung und Verwaltung unserer Tischreservierungen verwenden wir Supabase.</p>
        <p>Die Datenbank unserer Anwendung befindet sich in der Region Frankfurt am Main, Deutschland, innerhalb der Europäischen Union.</p>
        <p>In der Datenbank werden die für die Verwaltung Ihrer Reservierung erforderlichen Informationen gespeichert.</p>
        <p>Die Verarbeitung erfolgt zur Bearbeitung und Durchführung Ihrer Reservierung gemäß Art. 6 Abs. 1 lit. b DSGVO.</p>
        <p>Die Speicherung der Datenbank in Frankfurt schließt eine Verarbeitung personenbezogener Daten in Drittländern durch den Anbieter oder eingesetzte Unterauftragsverarbeiter nicht grundsätzlich aus. Soweit entsprechende Übermittlungen stattfinden, sind die gesetzlichen Anforderungen der Art. 44 ff. DSGVO einzuhalten.</p>
        <p>Weitere Informationen: <ExternalLink href="https://supabase.com/privacy">Supabase Privacy Policy</ExternalLink></p>
      </PolicySection>

      <PolicySection number={6} title="Reservierungsbestätigungen per E-Mail">
        <p>Für den Versand von E-Mails im Zusammenhang mit Tischreservierungen verwenden wir Resend.</p>
        <p>Anbieter ist Plus Five Five, Inc., USA.</p>
        <p>Wenn Sie eine Reservierung durchführen, verwenden wir Ihre E-Mail-Adresse und die erforderlichen Buchungsinformationen, um Ihnen beispielsweise folgende Nachrichten zu senden:</p>
        <ul><li>Reservierungsbestätigungen</li><li>Informationen über Änderungen</li><li>Stornierungsbestätigungen</li><li>Sonstige unmittelbar mit Ihrer Reservierung zusammenhängende Mitteilungen</li></ul>
        <p>Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. b DSGVO zur Durchführung Ihrer Reservierung.</p>
        <p>Resend verarbeitet und speichert Daten in den USA. Für entsprechende internationale Datenübermittlungen werden nach Angaben des Anbieters geeignete Garantien, insbesondere EU-Standardvertragsklauseln, eingesetzt.</p>
        <p>Wir verwenden Ihre E-Mail-Adresse im Rahmen dieses Systems nicht für den Versand von Werbenachrichten oder Newslettern.</p>
        <p>Weitere Informationen: <ExternalLink href="https://resend.com/legal/privacy-policy">Resend Privacy Policy</ExternalLink></p>
      </PolicySection>

      <PolicySection number={7} title="Speicherdauer und Löschung">
        <p>Wir speichern personenbezogene Reservierungsdaten grundsätzlich nur so lange, wie dies für die jeweiligen Verarbeitungszwecke erforderlich ist.</p>
        <p>Gewöhnliche Reservierungsdatensätze werden grundsätzlich 30 Tage nach dem Reservierungsdatum gelöscht.</p>
        <p>Eine längere Speicherung kann erfolgen, soweit gesetzliche Aufbewahrungspflichten bestehen oder die Daten zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich sind.</p>
        <p>Für technische Protokolldaten, E-Mail-Versandprotokolle und Sicherungskopien können abweichende Speicherfristen der jeweiligen Dienstleister gelten.</p>
      </PolicySection>

      <PolicySection number={8} title="Cookies und ähnliche Technologien">
        <p>Unsere Website kann technisch notwendige Cookies oder vergleichbare Speichertechnologien verwenden, sofern diese für die Bereitstellung der Website und ihrer Funktionen erforderlich sind.</p>
        <p>Soweit technisch nicht notwendige Technologien eingesetzt werden, die eine Einwilligung erfordern, werden diese erst nach Ihrer vorherigen Zustimmung verwendet.</p>
        <p>Eine erteilte Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden.</p>
      </PolicySection>

      <PolicySection number={9} title="Ihre Rechte">
        <p>Sie haben im Rahmen der gesetzlichen Voraussetzungen insbesondere folgende Rechte:</p>
        <ul><li>Auskunft: Art. 15 DSGVO</li><li>Berichtigung: Art. 16 DSGVO</li><li>Löschung: Art. 17 DSGVO</li><li>Einschränkung der Verarbeitung: Art. 18 DSGVO</li><li>Datenübertragbarkeit: Art. 20 DSGVO</li><li>Widerspruch gegen bestimmte Verarbeitungen: Art. 21 DSGVO</li><li>Widerruf erteilter Einwilligungen: Art. 7 Abs. 3 DSGVO</li></ul>
        <p>Zur Ausübung Ihrer Rechte oder bei Fragen und Anliegen schreiben Sie uns bitte eine E-Mail an die in Abschnitt 1 genannten Kontaktdaten.</p>
      </PolicySection>

      <PolicySection number={10} title="Datensicherheit">
        <p>Wir setzen angemessene technische und organisatorische Maßnahmen ein, um personenbezogene Daten vor unbefugtem Zugriff, Verlust, Veränderung und unrechtmäßiger Verarbeitung zu schützen.</p>
        <p>Die Übertragung von Daten zwischen Ihrem Browser und unserer Website erfolgt über eine verschlüsselte HTTPS-Verbindung.</p>
      </PolicySection>

    </>
  );
}

function EnglishPolicy({ dictionary }: { dictionary: Dictionary }) {
  return (
    <>
      <PolicySection number={1} title="Controller">
        <p>The controller responsible for processing personal data on this website is:</p>
        <address className="not-italic text-espresso">
          Altstadtliebe<br />
          Kubilay Kilic<br />
          Mühlenstraße 51<br />
          23552 Lübeck<br />
          Germany
        </address>
        <p>Phone: <a className="font-medium text-espresso underline decoration-espresso/25 underline-offset-4" href={dictionary.location.phoneHref}>{dictionary.location.phoneLabel}</a></p>
      </PolicySection>

      <PolicySection number={2} title="General information on data protection">
        <p>Protecting your personal data is important to us. We process your data confidentially and in accordance with the General Data Protection Regulation (GDPR) and applicable German data-protection laws.</p>
        <p>Personal data is any information that can be used to identify you personally.</p>
        <p>This privacy policy explains which data we collect, the purposes for which we use it, and the rights available to you.</p>
      </PolicySection>

      <PolicySection number={3} title="Hosting by Vercel">
        <p>Our website is provided through Vercel.</p>
        <p>The provider is Vercel Inc., USA.</p>
        <p>When you visit our website, technically necessary information may be processed, in particular:</p>
        <ul><li>IP address</li><li>Date and time of access</li><li>Pages and files requested</li><li>Browser type and operating system</li><li>Technical request and connection information</li></ul>
        <p>This data is processed to provide the website, maintain its security, and identify technical faults.</p>
        <p>Processing is based on Article 6(1)(f) GDPR. Our legitimate interest is the secure and reliable operation of our website.</p>
        <p>Personal data may be processed outside the European Union as part of the hosting services. The applicable data-protection safeguards must be observed in such cases.</p>
        <p>Further information: <ExternalLink href="https://vercel.com/legal/privacy-policy">Vercel Privacy Policy</ExternalLink></p>
      </PolicySection>

      <PolicySection number={4} title="Online table reservations">
        <p>You can reserve a table at our café through our website.</p>
        <p>For this purpose, we process the following information:</p>
        <ul><li>First and last name</li><li>Email address</li><li>Reservation date</li><li>Reservation time</li><li>Number of guests</li><li>Optional special requests or messages</li></ul>
        <p>We use this data solely to process, organise, confirm, and manage your table reservation and for related communication.</p>
        <p>Processing is based on Article 6(1)(b) GDPR for pre-contractual measures and the handling of your reservation.</p>
        <p>The required reservation details are necessary for us to process your booking. Optional messages are not required.</p>
        <p>Please avoid submitting sensitive personal information, particularly health data, in the special-requests field.</p>
      </PolicySection>

      <PolicySection number={5} title="Database and storage by Supabase">
        <p>We use Supabase to securely store and manage our table reservations.</p>
        <p>Our application database is located in the Frankfurt am Main region in Germany, within the European Union.</p>
        <p>The information required to manage your reservation is stored in this database.</p>
        <p>Processing is carried out to handle and fulfil your reservation in accordance with Article 6(1)(b) GDPR.</p>
        <p>Database storage in Frankfurt does not entirely rule out the processing of personal data in third countries by the provider or its subprocessors. Where such transfers take place, the legal requirements of Articles 44 et seq. GDPR must be observed.</p>
        <p>Further information: <ExternalLink href="https://supabase.com/privacy">Supabase Privacy Policy</ExternalLink></p>
      </PolicySection>

      <PolicySection number={6} title="Reservation confirmations by email">
        <p>We use Resend to send emails relating to table reservations.</p>
        <p>The provider is Plus Five Five, Inc., USA.</p>
        <p>When you make a reservation, we use your email address and the necessary booking information to send messages such as:</p>
        <ul><li>Reservation confirmations</li><li>Information about changes</li><li>Cancellation confirmations</li><li>Other messages directly related to your reservation</li></ul>
        <p>Processing is carried out under Article 6(1)(b) GDPR to fulfil your reservation.</p>
        <p>Resend processes and stores data in the USA. According to the provider, appropriate safeguards, in particular EU Standard Contractual Clauses, are used for relevant international data transfers.</p>
        <p>We do not use your email address through this system to send advertising or newsletters.</p>
        <p>Further information: <ExternalLink href="https://resend.com/legal/privacy-policy">Resend Privacy Policy</ExternalLink></p>
      </PolicySection>

      <PolicySection number={7} title="Retention and deletion">
        <p>As a rule, we retain personal reservation data only for as long as necessary for the respective processing purposes.</p>
        <p>Standard reservation records are generally deleted 30 days after the reservation date.</p>
        <p>Data may be retained for longer where statutory retention obligations apply or where the data is required to establish, exercise, or defend legal claims.</p>
        <p>Different retention periods may apply to technical logs, email-delivery logs, and backups maintained by the respective service providers.</p>
      </PolicySection>

      <PolicySection number={8} title="Cookies and similar technologies">
        <p>Our website may use technically necessary cookies or comparable storage technologies where these are required to provide the website and its functions.</p>
        <p>If non-essential technologies requiring consent are used, they will be activated only after your prior consent.</p>
        <p>Consent may be withdrawn at any time with effect for the future.</p>
      </PolicySection>

      <PolicySection number={9} title="Your rights">
        <p>Subject to the statutory requirements, you have the following rights in particular:</p>
        <ul><li>Access: Article 15 GDPR</li><li>Rectification: Article 16 GDPR</li><li>Erasure: Article 17 GDPR</li><li>Restriction of processing: Article 18 GDPR</li><li>Data portability: Article 20 GDPR</li><li>Objection to certain processing: Article 21 GDPR</li><li>Withdrawal of consent: Article 7(3) GDPR</li></ul>
        <p>To exercise your rights or if you have any questions or issues, please send us an email using the contact details in Section 1.</p>
      </PolicySection>

      <PolicySection number={10} title="Data security">
        <p>We use appropriate technical and organisational measures to protect personal data against unauthorised access, loss, alteration, and unlawful processing.</p>
        <p>Data transmitted between your browser and our website is protected by an encrypted HTTPS connection.</p>
      </PolicySection>

    </>
  );
}

const policyNavigation = {
  de: [
    "Verantwortlicher",
    "Allgemeine Hinweise zum Datenschutz",
    "Hosting durch Vercel",
    "Online-Tischreservierungen",
    "Datenbank und Speicherung durch Supabase",
    "Reservierungsbestätigungen per E-Mail",
    "Speicherdauer und Löschung",
    "Cookies und ähnliche Technologien",
    "Ihre Rechte",
    "Datensicherheit",
  ],
  en: [
    "Controller",
    "General information on data protection",
    "Hosting by Vercel",
    "Online table reservations",
    "Database and storage by Supabase",
    "Reservation confirmations by email",
    "Retention and deletion",
    "Cookies and similar technologies",
    "Your rights",
    "Data security",
  ],
} as const;

export function PrivacyPolicyPage({ locale, dictionary }: PrivacyPolicyPageProps) {
  const isGerman = locale === "de";
  const homeHref = isGerman ? "/" : "/en";
  const languageHref = isGerman ? "/en/privacy" : "/datenschutz";
  const sections = policyNavigation[locale];

  return (
    <div className="min-h-screen overflow-x-hidden bg-ivory text-espresso">
      <header className="page-gutter pt-6 md:pt-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 pb-5 md:pb-7">
          <Link href={homeHref} className="group inline-flex items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass" aria-label="Altstadtliebe — home">
            <Image src="/altstadtliebe-logo.png" alt="Altstadtliebe" width={192} height={64} priority className="h-auto w-32 object-contain transition-transform duration-300 group-hover:scale-[1.015] md:w-44" />
          </Link>
          <div className="flex items-center gap-4 text-xs font-medium text-espresso-soft md:gap-7 md:text-sm">
            <Link href={languageHref} className="transition-colors hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
              {isGerman ? "English" : "Deutsch"}
            </Link>
            <Link href={homeHref} className="transition-colors hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
              <span className="sm:hidden">{isGerman ? "Zurück" : "Back"}</span>
              <span className="hidden sm:inline">{isGerman ? "Zurück zu Altstadtliebe" : "Back to Altstadtliebe"}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="page-gutter pb-20 pt-14 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <header className="max-w-4xl pb-14 md:pb-20">
            <h1 lang={locale} className="editorial-heading text-[clamp(3.15rem,7.5vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
              {isGerman ? <>Datenschutz<wbr />erklärung</> : "Privacy Policy"}
            </h1>
            <p className="mt-6 text-sm font-medium text-espresso-soft md:mt-7 md:text-base">
              {isGerman ? "Stand: 22. Oktober 2026" : "Last updated: 22 October 2026"}
            </p>
          </header>

          <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20 xl:gap-28">
            <article className="min-w-0 max-w-4xl">
              {isGerman ? <GermanPolicy dictionary={dictionary} /> : <EnglishPolicy dictionary={dictionary} />}

              <Link href={homeHref} className="mt-10 inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-[#eee9e1]/60 px-5 text-sm font-medium text-espresso transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-espresso/30 hover:bg-[#eee9e1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass md:mt-14">
                {isGerman ? "Zurück zur Startseite" : "Back to homepage"}
              </Link>
            </article>

            <aside className="sticky top-8 hidden lg:block" aria-label={isGerman ? "Inhalt dieser Seite" : "On this page"}>
              <p className="text-sm font-semibold text-espresso">{isGerman ? "Auf dieser Seite" : "On this page"}</p>
              <nav className="mt-5">
                <ol className="space-y-3.5">
                  {sections.map((title, index) => (
                    <li key={title}>
                      <a href={`#privacy-section-${index + 1}`} className="block text-[0.8rem] leading-[1.35] text-espresso-soft transition-[color,transform] hover:translate-x-0.5 hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
                        {title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
