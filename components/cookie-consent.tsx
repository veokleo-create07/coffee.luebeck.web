"use client";

import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const CONSENT_STORAGE_KEY = "altstadtliebe-cookie-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "altstadtliebe:open-cookie-settings";
const CONSENT_CHANGE_EVENT = "altstadtliebe:cookie-consent-changed";
const CONSENT_VERSION = 1;

type ConsentPreferences = {
  version: number;
  essential: true;
  googleMaps: boolean;
  updatedAt: string;
};

type ConsentContextValue = {
  preferences: ConsentPreferences | null;
  googleMapsAllowed: boolean;
  openSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const copy = {
  de: {
    bannerTitle: "Deine Privatsphäre, deine Entscheidung.",
    bannerBody: "Wir verwenden notwendige Speichertechnologien für den Betrieb der Website. Google Maps wird nur mit deiner Zustimmung geladen.",
    accept: "Alle akzeptieren",
    reject: "Optionale ablehnen",
    settings: "Einstellungen",
    privacy: "Datenschutzerklärung",
    dialogTitle: "Cookie-Einstellungen",
    dialogIntro: "Du entscheidest, welche optionalen Dienste geladen werden. Deine Auswahl kannst du jederzeit im Footer ändern.",
    essentialTitle: "Notwendig",
    essentialBody: "Erforderlich für grundlegende Funktionen und zum Speichern deiner Datenschutz-Auswahl. Immer aktiv.",
    mapsTitle: "Google Maps",
    mapsBody: "Lädt interaktive Karten von Google. Dabei können Daten an Google übertragen und außerhalb der EU verarbeitet werden.",
    alwaysActive: "Immer aktiv",
    save: "Auswahl speichern",
    close: "Einstellungen schließen",
  },
  en: {
    bannerTitle: "Your privacy, your choice.",
    bannerBody: "We use essential storage technologies to operate this website. Google Maps loads only with your consent.",
    accept: "Accept all",
    reject: "Reject optional",
    settings: "Settings",
    privacy: "Privacy policy",
    dialogTitle: "Cookie settings",
    dialogIntro: "You decide which optional services may load. You can change your choice at any time in the footer.",
    essentialTitle: "Essential",
    essentialBody: "Required for core functions and to save your privacy choice. Always active.",
    mapsTitle: "Google Maps",
    mapsBody: "Loads interactive maps from Google. Data may be transferred to Google and processed outside the EU.",
    alwaysActive: "Always active",
    save: "Save selection",
    close: "Close settings",
  },
} as const;

function readStoredPreferences(): ConsentPreferences | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<ConsentPreferences>;
    if (parsed.version !== CONSENT_VERSION || parsed.essential !== true || typeof parsed.googleMaps !== "boolean") return null;
    return parsed as ConsentPreferences;
  } catch {
    return null;
  }
}

function disableGoogleMaps() {
  document.querySelectorAll<HTMLIFrameElement>('iframe[src*="google.com/maps"], iframe[src*="google.de/maps"], iframe[src*="maps.google"]')
    .forEach((frame) => frame.remove());
  document.querySelectorAll<HTMLScriptElement>('script[src*="maps.googleapis.com"], script[src*="maps.google.com"], script[src*="maps.gstatic.com"]')
    .forEach((script) => script.remove());
}

export function useCookieConsent() {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return value;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "de";
  const text = copy[locale];
  const privacyHref = locale === "de" ? "/datenschutz" : "/en/privacy";
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [googleMapsDraft, setGoogleMapsDraft] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openSettings = useCallback(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setGoogleMapsDraft(preferences?.googleMaps ?? false);
    setSettingsOpen(true);
  }, [preferences]);

  useEffect(() => {
    const stored = readStoredPreferences();
    setPreferences(stored);
    if (!stored?.googleMaps) disableGoogleMaps();
    setReady(true);
  }, []);

  useEffect(() => {
    const handleOpen = () => openSettings();
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpen);
  }, [openSettings]);

  useEffect(() => {
    if (!settingsOpen) return;
    const panel = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])') ?? []);
    window.requestAnimationFrame(() => focusable()[0]?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [settingsOpen]);

  function savePreferences(googleMaps: boolean) {
    const next: ConsentPreferences = {
      version: CONSENT_VERSION,
      essential: true,
      googleMaps,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    if (!googleMaps) disableGoogleMaps();
    setPreferences(next);
    setGoogleMapsDraft(googleMaps);
    setSettingsOpen(false);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: next }));
  }

  const contextValue: ConsentContextValue = {
    preferences,
    googleMapsAllowed: preferences?.googleMaps === true,
    openSettings,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}

      {ready && !preferences && !settingsOpen ? (
        <section className="cookie-banner" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-description">
          <div className="cookie-banner-copy">
            <div className="cookie-banner-icon" aria-hidden="true"><ShieldCheck size={20} strokeWidth={1.7} /></div>
            <div>
              <h2 id="cookie-banner-title" className="text-base font-semibold tracking-[-0.02em]">{text.bannerTitle}</h2>
              <p id="cookie-banner-description" className="mt-1 text-sm leading-[1.45] text-espresso-soft">
                {text.bannerBody}{" "}<Link href={privacyHref} className="font-medium text-espresso underline decoration-espresso/25 underline-offset-4">{text.privacy}</Link>
              </p>
            </div>
          </div>
          <div className="cookie-banner-actions">
            <button type="button" className="cookie-action" onClick={() => savePreferences(true)}>{text.accept}</button>
            <button type="button" className="cookie-action" onClick={() => savePreferences(false)}>{text.reject}</button>
            <button type="button" className="cookie-action" onClick={openSettings}>{text.settings}</button>
          </div>
        </section>
      ) : null}

      {settingsOpen ? (
        <div className="cookie-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
          <div ref={dialogRef} className="cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-dialog-title" aria-describedby="cookie-dialog-description">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow">Altstadtliebe</p>
                <h2 id="cookie-dialog-title" className="mt-3 text-3xl font-semibold leading-none tracking-[-0.045em] md:text-4xl">{text.dialogTitle}</h2>
              </div>
              <button type="button" className="cookie-close" onClick={() => setSettingsOpen(false)} aria-label={text.close}><X size={20} strokeWidth={1.6} aria-hidden="true" /></button>
            </div>
            <p id="cookie-dialog-description" className="mt-5 max-w-xl text-sm leading-[1.55] text-espresso-soft md:text-base">{text.dialogIntro}</p>

            <div className="mt-7 divide-y divide-espresso/12 border-y border-espresso/12">
              <div className="cookie-category">
                <div>
                  <h3 className="font-semibold">{text.essentialTitle}</h3>
                  <p className="mt-1 text-sm leading-[1.45] text-espresso-soft">{text.essentialBody}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-olive-deep">{text.alwaysActive}</span>
              </div>
              <div className="cookie-category">
                <div>
                  <h3 className="font-semibold">{text.mapsTitle}</h3>
                  <p className="mt-1 text-sm leading-[1.45] text-espresso-soft">{text.mapsBody}</p>
                </div>
                <label className="cookie-switch">
                  <span className="sr-only">{text.mapsTitle}</span>
                  <input type="checkbox" checked={googleMapsDraft} onChange={(event) => setGoogleMapsDraft(event.target.checked)} />
                  <span className="cookie-switch-track" aria-hidden="true"><span /></span>
                </label>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <button type="button" className="cookie-action" onClick={() => savePreferences(googleMapsDraft)}>{text.save}</button>
              <button type="button" className="cookie-action" onClick={() => savePreferences(true)}>{text.accept}</button>
              <button type="button" className="cookie-action" onClick={() => savePreferences(false)}>{text.reject}</button>
            </div>
            <Link href={privacyHref} className="mt-5 inline-block text-sm font-medium underline decoration-espresso/25 underline-offset-4 hover:decoration-espresso">{text.privacy}</Link>
          </div>
        </div>
      ) : null}
    </ConsentContext.Provider>
  );
}
