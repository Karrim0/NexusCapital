import { useEffect, useState, useCallback } from "react";
import { fetchHomeContent } from "../api/homeContent";
import homeContentDefaults from "../utils/homeContentDefaults";

// Deep-merges the fetched content onto the local defaults so that a field
// missing on the server (e.g. right after a fresh migration) never breaks
// rendering — it just falls back to the default copy.
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

export const useHomeContent = () => {
  const [content, setContent] = useState(homeContentDefaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHomeContent();
      setContent(deepMerge(homeContentDefaults, data));
      setError(null);
    } catch (err) {
      // Keep showing the defaults if the API isn't reachable.
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { content, loading, error, reload: load };
};

export default useHomeContent;
