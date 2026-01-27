import { find } from "lodash-es";
import { useEffect, useState } from "react";
import { useOnchainData } from "..";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useContextApi } from "next-common/context/api";

export function useReferendumFellowshipCoreEvidenceForWho(who) {
  const pallet = useCoreFellowshipPallet();

  const [wish, setWish] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);

  const api = useContextApi();

  useEffect(() => {
    if (!who || !pallet || !api) {
      return;
    }

    api.query[pallet]
      ?.memberEvidence(who)
      .then((optional) => {
        if (optional.isNone) {
          return;
        }

        const [wish, text] = optional.unwrap().toJSON();
        setWish(wish);
        setEvidence(text);
      })
      .finally(() => setLoading(false));
  }, [api, who, pallet]);

  return {
    wish,
    evidence,
    loading,
  };
}

export function useReferendumFellowshipCoreEvidence() {
  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || onchainData.proposal || {};
  const who = find(call?.args, { name: "who" })?.value;

  return useReferendumFellowshipCoreEvidenceForWho(who);
}
