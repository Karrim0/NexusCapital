import { useEffect, useState, useCallback } from "react";
import { fetchLegalServicesContent } from "../api/legalServicesContent";
import legalServicesContentDefaults from "../utils/legalServicesContentDefaults";

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

export const useLegalServicesContent = () => {
  const [content, setContent] = useState(legalServicesContentDefaults);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLegalServicesContent();
      setContent(deepMerge(legalServicesContentDefaults, data));
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { content, loading, reload: load };
};

export default useLegalServicesContent;
