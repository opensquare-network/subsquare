import { find } from "lodash-es";
import { useEffect, useState } from "react";
import { useOnchainData } from "..";
import {
  useReferendumVotingFinishIndexer,
} from "../referenda/useReferendumVotingFinishHeight";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useBlockApi from "next-common/utils/hooks/useBlockApi";

export function useReferendumFellowshipCoreEvidence() {
  const pallet = useCoreFellowshipPallet();

  const finishedIndexer = useReferendumVotingFinishIndexer();

  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || onchainData.proposal || {};
  const who = find(call?.args, { name: "who" })?.value;

  const [wish, setWish] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);

  const blockApi = useBlockApi(finishedIndexer?.blockHash);

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
