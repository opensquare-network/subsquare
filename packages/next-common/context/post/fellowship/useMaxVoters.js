import { useDetailType } from "../../page";
import { detailPageCategory } from "../../../utils/consts/business/category";
import { useEffect, useState } from "react";
import { useTrack } from "../gov2/track";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import { isNil } from "lodash-es";
import { useOnchainData } from "../index";
import { useDispatch } from "react-redux";
import {
  clearFellowshipMaxVoters,
  setFellowshipMaxVoters,
} from "../../../store/reducers/fellowship/maxVoters";
import { useContextApi } from "next-common/context/api";

export function getFellowshipMinRankOfClass(trackId) {
  if (trackId <= 9) {
    return trackId;
  } else if (trackId >= 11 && trackId <= 16) {
    return trackId - 8;
  } else if (trackId >= 21 && trackId <= 26) {
    return trackId - 18;
  } else {
    return Number.MAX_VALUE; // max rank
  }
}

export function getAmbassadorMinRankOfClass(trackId) {
  return trackId;
}

export function getMinRankOfClass(trackId, pallet) {
  if ("fellowshipCollective" === pallet) {
    return getFellowshipMinRankOfClass(trackId);
  } else if ("ambassadorCollective" === pallet) {
    return getAmbassadorMinRankOfClass(trackId);
  } else {
    throw new Error(`Can not get min rank of class for pallet ${pallet}`);
  }
}

async function queryMaxVoters(
  api,
  trackId,
  votingFinishHeight,
  pallet = "fellowshipCollective",
) {
  let blockApi = api;
  if (!isNil(votingFinishHeight)) {
    const blockHash = await api.rpc.chain.getBlockHash(votingFinishHeight);
    blockApi = await api.at(blockHash);
  }

  const rank = getMinRankOfClass(trackId, pallet);
  const count = await blockApi.query[pallet].memberCount(rank);
  return count.toNumber();
}

export default function useFetchMaxVoters(pallet = "fellowshipCollective") {
  const { id: trackId } = useTrack();
  const pageType = useDetailType();
  const onchain = useOnchainData();
  const tally = onchain.tally || onchain?.info?.tally;
  const [maxVoters, setMaxVoters] = useState(tally.electorate || 0);
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFellowshipMaxVoters(maxVoters));

    return () => {
      dispatch(clearFellowshipMaxVoters());
    };
  }, [dispatch, maxVoters]);

  if (
    ![
      detailPageCategory.FELLOWSHIP_REFERENDUM,
      detailPageCategory.AMBASSADOR_REFERENDUM,
    ].includes(pageType)
  ) {
    throw new Error(
      "useMaxVoters should be only be used on fellowship/ambassador referendum detail page",
    );
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    queryMaxVoters(api, trackId, votingFinishHeight, pallet).then((count) =>
      setMaxVoters(count),
    );
  }, [api, pallet, trackId, votingFinishHeight]);

  return maxVoters;
}
