import { find, isNil } from "lodash-es";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useOnchainData } from "..";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useContextApi } from "next-common/context/api";
import { getBlockApi } from "next-common/services/chain/api";

function useBlockApi(finishHeight) {
  const latestHeight = useSelector(latestHeightSelector);
  const api = useContextApi();
  const [blockApi, setBlockApi] = useState();

  useEffect(() => {
    if (isNil(finishHeight) || !api) {
      return;
    }

    getBlockApi(api, finishHeight).then(setBlockApi);
  }, [api, finishHeight]);

  return useMemo(() => {
    if (isNil(finishHeight)) {
      return api;
    }

    if (isNil(latestHeight)) {
      return;
    }

    if (latestHeight > finishHeight) {
      return blockApi;
    }

    return api;
  }, [latestHeight, api, blockApi]);
}

export function useReferendumFellowshipCoreEvidence() {
  const pallet = useCoreFellowshipPallet();

  const finishHeight = useReferendumVotingFinishHeight();

  const onchainData = useOnchainData();
  const { call } = onchainData?.inlineCall || {};
  const who = find(call?.args, { name: "who" })?.value;

  const [wish, setWish] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);

  const blockApi = useBlockApi(finishHeight);

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
