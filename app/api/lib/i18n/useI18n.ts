"use client";

import { useEffect, useState } from "react";
import { messages, Locale } from "./messages";

const DEFAULT_LOCALE: Locale = "en";

export function useI18n() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && messages[saved]) setLocale(saved);
  }, []);

  function changeLocale(next: Locale) {
    localStorage.setItem("locale", next);
    setLocale(next);
  }

  function t(key: string) {
    return messages[locale]?.[key] ?? messages.en[key] ?? key;
  }

  return {
    locale,
    changeLocale,
    t,
  };
}
