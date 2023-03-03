import { useDetailType } from "../../page";
import { detailPageCategory } from "../../../utils/consts/business/category";
import { useEffect, useState } from "react";
import useApi from "../../../utils/hooks/useApi";
import { useTrack } from "../gov2/track";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import isNil from "lodash.isnil";

async function queryMaxVoters(api, trackId, votingFinishHeight) {
  let blockApi = api;
  if (!isNil(votingFinishHeight)) {
    const blockHash = await api.rpc.chain.getBlockHash(votingFinishHeight);
    blockApi = await api.at(blockHash);
  }

  const count = await blockApi.query.fellowshipCollective.memberCount(trackId);
  return count.toNumber();
}

export default function useMaxVoters() {
  const { id: trackId } = useTrack();
  const pageType = useDetailType();
  const [maxVoters, setMaxVoters] = useState(0);
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const api = useApi();

  if (detailPageCategory.FELLOWSHIP_REFERENDUM !== pageType) {
    throw new Error(
      "useMaxVoters should be only be used on fellowship referendum detail page",
    );
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    queryMaxVoters(api, trackId, votingFinishHeight).then((count) =>
      setMaxVoters(count),
    );
  }, [api, trackId, votingFinishHeight]);

  return maxVoters;
}
