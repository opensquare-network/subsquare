import { useMemo, useState, useEffect, useCallback } from "react";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import ExternalLink from "next-common/components/externalLink";
import { backendApi } from "next-common/services/nextApi";

function useDVCohorts() {
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

function useReferendaDVCohortID({ indexer, cohorts }) {
  return useMemo(() => {
    if (!indexer?.blockHeight || !cohorts?.length) {
      return null;
    }

    const matchedCohort = cohorts.find((cohort) => {
      const startHeight = cohort.startIndexer?.blockHeight;
      const endHeight = cohort.endIndexer?.blockHeight;
      if (!startHeight) {
        return false;
      }

      if (!endHeight) {
        return indexer.blockHeight >= startHeight;
      }

      return (
        indexer.blockHeight >= startHeight && indexer.blockHeight <= endHeight
      );
    });

    if (!matchedCohort) {
      return null;
    }

    return matchedCohort.id;
  }, [indexer, cohorts]);
}

export default function DVCohortDetailLink() {
  const { indexer } = useOnchainData();
  const { cohorts, loading } = useDVCohorts();
  const cohortID = useReferendaDVCohortID({ indexer, cohorts });
  if (loading || isNil(cohortID)) {
    return null;
  }

  return (
    <div className="mt-4">
      <span className="text14Medium text-textSecondary">
        Check more data of decentralized voices{" "}
        <ExternalLink
          className="font-bold text-theme500"
          href={`/referenda/dv/cohorts/${cohortID}`}
        >
          here
        </ExternalLink>
        .
      </span>
    </div>
  );
}
