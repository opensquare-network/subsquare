import { find } from "lodash-es";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOnchainData } from "..";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";

export function useReferendumCoreFellowshipEvidence() {
  const { section } = useCollectivesContext();
  let pallet;
  if (section === "fellowship") {
    pallet = "fellowshipCore";
  } else if (section === "ambassador") {
    pallet = "ambassadorCore";
  }

  const latestHeight = useSelector(latestHeightSelector);
  const finishHeight = useReferendumVotingFinishHeight();

  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || {};
  const who = find(call?.args, { name: "who" })?.value;

  const [wish, setWish] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);

  const isFinished = latestHeight > finishHeight;
  const blockApi = useBlockApi(isFinished ? finishHeight : null);

  useEffect(() => {
    if (!who || !pallet || !blockApi) {
      return;
    }

    effect();

    async function effect() {
      try {
        const evidence = await blockApi.query[pallet]?.memberEvidence(who);
        const data = evidence?.toJSON();
        if (!data) {
          return;
        }
        const [wish, text] = data;
        setWish(wish);
        setEvidence(text);
      } finally {
        setLoading(false);
      }
    }
  }, [blockApi, who, pallet]);

  return {
    wish,
    evidence,
    loading,
  };
}
