import { useState, useEffect, useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";

export default function useDVCohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCohorts = useCallback(async () => {
    try {
      setLoading(true);
      const { result: cohorts = [] } = await backendApi.fetch("/dv/cohorts");
      setCohorts(cohorts);
    } catch (err) {
      throw new Error("Failed to fetch cohorts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  return { cohorts, loading };
}
