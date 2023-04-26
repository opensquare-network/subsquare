import { useOnchainData, useTimelineData } from "../index";
import findLast from "lodash.findlast";
import findLastIndex from "lodash.findlastindex";
import useApi from "../../../utils/hooks/useApi";
import { useEffect, useState } from "react";
import { useDetailType } from "../../page";
import { detailPageCategory } from "../../../utils/consts/business/category";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import useIsMounted from "../../../utils/hooks/useIsMounted";

export function useDecidingSince() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.since;
}

export function useDecisionDeposit() {
  const onchain = useOnchainData();
  return onchain.info?.decisionDeposit;
}

export function useSubmittedAt() {
  const onchain = useOnchainData();
  return onchain.info?.submitted;
}

export function useConfirming() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.confirming;
}

async function queryReferendumInfo(
  api,
  palletName,
  referendumIndex,
  votingFinishHeight,
) {
  let blockApi = api;
  if (votingFinishHeight) {
    const blockHash = await api.rpc.chain.getBlockHash(votingFinishHeight - 1);
    if (blockHash) {
      blockApi = await api.at(blockHash);
    }
  }

  return blockApi.query[palletName].referendumInfoFor(referendumIndex);
}

export function useTally() {
  const onchain = useOnchainData();
  const { referendumIndex } = onchain;
  const [tally, setTally] = useState(onchain?.info?.tally);
  const pageType = useDetailType();
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useIsMounted();

  const api = useApi();

  useEffect(() => {
    if (!api) {
      return;
    }

    let palletName;
    if (detailPageCategory.GOV2_REFERENDUM === pageType) {
      palletName = "referenda";
    } else if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
      palletName = "fellowshipReferenda";
    } else {
      return;
    }

    queryReferendumInfo(
      api,
      palletName,
      referendumIndex,
      votingFinishHeight,
    ).then((optionalInfo) => {
      if (!isMounted.current || !optionalInfo.isSome) {
        return;
      }

      const info = optionalInfo.unwrap();
      if (!info.isOngoing) {
        return;
      }

      setTally(info.asOngoing.tally.toJSON());
    });
  }, [api, referendumIndex, pageType, votingFinishHeight]);
  return tally;
}

export function useConfirmingStarted() {
  const timeline = useTimelineData();
  const startedItem = findLast(
    timeline,
    (item) => item.name === "ConfirmStarted",
  );
  return startedItem?.indexer?.blockHeight;
}

export function useConfirmTimelineData() {
  const timeline = useTimelineData();
  return timeline.filter((item) => {
    return ["ConfirmStarted", "ConfirmAborted", "Confirmed"].includes(
      item.name,
    );
  });
}

export function useConfirmTimelineFailPairs() {
  let pairs = [];

  const confirms = useConfirmTimelineData();
  const lastAbortedIndex = findLastIndex(
    confirms || [],
    (confirm) => confirm.name === "ConfirmAborted",
  );

  const arrStartedAndAborted = confirms.slice(
    0,
    lastAbortedIndex ? lastAbortedIndex + 1 : 0,
  );

  pairs = arrStartedAndAborted.reduce((res, _value, idx, arr) => {
    if (idx % 2 === 0) {
      res.push(arr.slice(idx, idx + 2));
    }
    return res;
  }, []);

  return pairs;
}
