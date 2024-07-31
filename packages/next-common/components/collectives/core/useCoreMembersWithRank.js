import { useContextApi } from "next-common/context/api";
import {
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import { useEffect, useState } from "react";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { isSameAddress } from "next-common/utils";

export default function useCoreMembersWithRank() {
  const api = useContextApi();
  const corePallet = useCoreFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    Promise.all([
      api.query[collectivePallet]?.members.entries(),
      api.query[corePallet].member.entries(),
    ])
      .then(([collectiveEntries, coreEntries]) => {
        const collectiveMembers =
          normalizeRankedCollectiveEntries(collectiveEntries);

        const normalizedMembers = coreEntries.map(
          ([storageKey, memberStatus]) => {
            const address = storageKey.args[0].toString();
            return {
              address,
              rank: collectiveMembers.find((m) =>
                isSameAddress(m.address, address),
              )?.rank,
              status: memberStatus.toJSON(),
            };
          },
        );

        setMembers(normalizedMembers);
      })
      .finally(() => setLoading(false));
  }, [api, corePallet, collectivePallet]);

  return {
    members,
    isLoading: loading,
  };
}
