import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fetchRentContent } from "../api/rentContent";
import rentContentDefaults from "../utils/rentContentDefaults";

const deepMerge = (base, incoming) => {
  if (Array.isArray(base)) {
    return Array.isArray(incoming) && incoming.length ? incoming : base;
  }
  if (base && typeof base === "object") {
    const out = { ...base };
    if (incoming && typeof incoming === "object") {
      Object.keys(incoming).forEach((key) => {
        out[key] = key in base ? deepMerge(base[key], incoming[key]) : incoming[key];
      });
    }
    return out;
  }
  return incoming ?? base;
};

export const useRentContent = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";

  const [content, setContent] = useState(rentContentDefaults);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRentContent();
      setContent(deepMerge(rentContentDefaults, data));
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, language]);

  return { content, loading, reload: load };
};

export default useRentContent;
