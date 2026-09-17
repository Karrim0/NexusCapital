import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, detectLanguageFromPath } from "../i18n";

const ABSOLUTE_OR_SPECIAL_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;
const UNPREFIXED_APP_PATHS = ["/dashboard"];

const splitPathSuffix = (value) => {
  const match = String(value || "/").match(/^([^?#]*)(.*)$/);
  return {
    pathname: match?.[1] || "/",
    suffix: match?.[2] || "",
  };
};

const normalizePathname = (pathname) => {
  if (!pathname) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
};

const shouldStayUnprefixed = (pathname) =>
  UNPREFIXED_APP_PATHS.some(
    (basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`)
  );

export const stripLangPrefix = (value = "/") => {
  if (ABSOLUTE_OR_SPECIAL_URL.test(value)) return value;

  const { pathname, suffix } = splitPathSuffix(value);
  const normalized = normalizePathname(pathname);
  const parts = normalized.split("/").filter(Boolean);

  if (parts.length > 0 && SUPPORTED_LANGUAGES.includes(parts[0])) {
    const remainingParts = parts.slice(1);
    const barePath = remainingParts.length > 0 ? `/${remainingParts.join("/")}` : "/";
    return `${barePath}${suffix}`;
  }

  return `${normalized}${suffix}`;
};

export const buildLocalizedPath = (language, value = "/") => {
  if (!value || ABSOLUTE_OR_SPECIAL_URL.test(value)) return value;

  const { pathname, suffix } = splitPathSuffix(value);
  const normalized = normalizePathname(pathname);

  if (shouldStayUnprefixed(normalized)) {
    return `${normalized}${suffix}`;
  }

  const barePath = stripLangPrefix(normalized);
  const activeLanguage = SUPPORTED_LANGUAGES.includes(language)
    ? language
    : DEFAULT_LANGUAGE;

  if (activeLanguage === DEFAULT_LANGUAGE) {
    return `${barePath}${suffix}`;
  }

  const localizedPath =
    barePath === "/" ? `/${activeLanguage}` : `/${activeLanguage}${barePath}`;

  return `${localizedPath}${suffix}`;
};

export const localizePathFromLocation = (value, currentPathname) =>
  buildLocalizedPath(detectLanguageFromPath(currentPathname), value);

export const getBarePathname = (pathname = "/") => {
  const stripped = stripLangPrefix(pathname);
  return splitPathSuffix(stripped).pathname || "/";
};
