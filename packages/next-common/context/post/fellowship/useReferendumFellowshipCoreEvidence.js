import { find } from "lodash-es";
import { useEffect, useState } from "react";
import { useOnchainData } from "..";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export function useReferendumFellowshipCoreEvidenceForWho(who) {
  const pallet = useCoreFellowshipPallet();

  const [wish, setWish] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);

  const blockApi = useConditionalContextApi();

  useEffect(() => {
    if (!who || !pallet || !blockApi) {
      return;
    }

    blockApi.query[pallet]
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
  }, [blockApi, who, pallet]);

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
