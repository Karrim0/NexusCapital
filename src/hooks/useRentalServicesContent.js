import { useEffect, useState, useCallback } from "react";
import { fetchRentalServicesContent } from "../api/rentalServicesContent";
import rentalServicesContentDefaults from "../utils/rentalServicesContentDefaults";

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

export const useRentalServicesContent = () => {
  const [content, setContent] = useState(rentalServicesContentDefaults);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRentalServicesContent();
      setContent(deepMerge(rentalServicesContentDefaults, data));
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

export default useRentalServicesContent;
