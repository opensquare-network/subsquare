import useApi from "../../hooks/useApi";
import useReferendumVotingFinishHeight from "../../../context/post/referenda/useReferendumVotingFinishHeight";
import { useEffect, useState } from "react";
import { useDetailType } from "../../../context/page";
import queryActiveBalance from "../../democracy/electorate/active";
import { detailPageCategory } from "../../consts/business/category";
import { useTrack } from "../../../context/post/gov2/track";
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

// used for gov2 referenda/fellowship referenda issuance
export default function useReferendaIssuance() {
  const api = useApi();
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const [issuance, setIssuance] = useState(0);
  const pageType = useDetailType();
  const { id: trackId } = useTrack();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (detailPageCategory.GOV2_REFERENDUM === pageType) {
      queryActiveBalance(api, votingFinishHeight).then((issuance) =>
        setIssuance(issuance)
      );
    } else if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
      queryMaxVoters(api, trackId, votingFinishHeight).then((maxVotersCount) =>
        setIssuance(maxVotersCount)
      );
    }
  }, [api, pageType, votingFinishHeight]);

  return issuance;
}
