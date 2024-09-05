import { orderBy, set, find } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import {
  useCollectivesContext,
  useSalaryFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-use";
import { useFellowshipCollectiveMembers } from "../core/useFellowshipCollectiveMembers";

let fetching = false;

const useLoading = createGlobalState(fetching);
const useCachedClaimants = createGlobalState({});

export function useFellowshipSalaryClaimants() {
  const api = useContextApi();
  const { section } = useCollectivesContext();

  const { members } = useFellowshipCollectiveMembers();

  const { fellowshipSalaryClaimants, ambassadorSalaryClaimants } =
    usePageProps();

  let claimantsFromServer;
  if (section === "fellowship") {
    claimantsFromServer = fellowshipSalaryClaimants;
  } else if (section === "ambassador") {
    claimantsFromServer = ambassadorSalaryClaimants;
  }

  const pallet = useSalaryFellowshipPallet();

  const [cachedClaimants, setCachedClaimants] = useCachedClaimants();
  const [loading, setLoading] = useLoading();

  const claimants = cachedClaimants?.[section];

  const fetch = useCallback(async () => {
    const salaryClaimant = api?.query?.[pallet]?.claimant;

    if (fetching || !api || !salaryClaimant) {
      return;
    }

    try {
      fetching = true;
      setLoading(fetching);

      const entries = await salaryClaimant.entries();
      const data = entries.map(([storageKey, record]) => {
        const address = storageKey.args[0].toString();
        const status = record.toJSON();

        return {
          address,
          status,
        };
      });

      setCachedClaimants((val) => {
        set(val, section, data);
        return val;
      });
    } finally {
      fetching = false;
      setLoading(fetching);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, pallet, section]);

  useEffect(() => {
    if (!claimants) {
      fetch();
    }
  }, [claimants, fetch]);

  const sortedClaimants = orderBy(
    (claimants || claimantsFromServer)?.map?.((claimant) => {
      const address = claimant?.address;
      const member = find(members, { address });
      const rank = member?.rank;

      return {
        rank,
        ...claimant,
      };
    }),
    "rank",
    "desc",
  );

  return {
    fetch,
    claimants: sortedClaimants,
    loading,
  };
}
