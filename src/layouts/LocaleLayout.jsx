import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../context/CustomizerContext";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../i18n";

const ALL_LANGUAGES = [DEFAULT_LANGUAGE, ...SUPPORTED_LANGUAGES];

/**
 * Wraps every public page. `lang` is passed explicitly by AppRouter — each
 * supported language has its own literal top-level route (/de, /fr, /ar
 * ...), so there is never any ambiguity between a real language code and an
 * unrelated unknown URL segment (those fall straight through to the 404
 * route instead). English has no prefix (e.g. /about) and is the default.
 *
 * This layout:
 *   - Switches i18next to the active language.
 *   - Sets <html lang="..." dir="rtl|ltr"> and syncs the RTL layout flag.
 *   - Emits <link rel="alternate" hreflang="..."> tags for every language
 *     version of the current page, for search engines.
 */
const LocaleLayout = ({ lang }) => {
  const activeLang = lang || DEFAULT_LANGUAGE;
  const location = useLocation();
  const { i18n } = useTranslation();
  const { updateSetting } = useCustomizer();

  useEffect(() => {
    if (i18n.language !== activeLang) {
      i18n.changeLanguage(activeLang);
    }
    const dir = activeLang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", activeLang);
    document.documentElement.setAttribute("dir", dir);
    updateSetting("direction", dir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLang]);

  // The current path with the language prefix stripped, so we can build
  // every other language's equivalent URL for the hreflang tags below.
  const barePath = lang
    ? "/" + location.pathname.split("/").filter(Boolean).slice(1).join("/")
    : location.pathname;
  const cleanBarePath = barePath === "/" ? "" : barePath;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <Helmet>
        <html lang={activeLang} dir={activeLang === "ar" ? "rtl" : "ltr"} />
        {ALL_LANGUAGES.map((code) => (
          <link
            key={code}
            rel="alternate"
            hrefLang={code}
            href={`${origin}${code === DEFAULT_LANGUAGE ? "" : "/" + code}${cleanBarePath}${
              code === DEFAULT_LANGUAGE && cleanBarePath === "" ? "/" : ""
            }`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${origin}${cleanBarePath || "/"}`} />
      </Helmet>
      <Outlet />
    </>
  );
};

export default LocaleLayout;
