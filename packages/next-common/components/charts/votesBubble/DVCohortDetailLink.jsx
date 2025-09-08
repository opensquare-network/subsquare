import { useMemo } from "react";
import { useOnchainData } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import ExternalLink from "next-common/components/externalLink";

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
  const { cohorts } = usePageProps();
  const cohortID = useReferendaDVCohortID({ indexer, cohorts });
  if (isNil(cohortID)) {
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
