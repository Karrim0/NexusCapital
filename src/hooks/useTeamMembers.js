import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fetchTeamMembers } from "../api/teamMembers";

export const useTeamMembers = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || "en";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTeamMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, language]);

  return { members, loading, reload: load };
};

export default useTeamMembers;
