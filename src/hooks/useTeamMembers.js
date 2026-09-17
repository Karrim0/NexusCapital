import { useEffect, useState, useCallback } from "react";
import { fetchTeamMembers } from "../api/teamMembers";

export const useTeamMembers = () => {
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
  }, [load]);

  return { members, loading, reload: load };
};

export default useTeamMembers;
