import { useEffect, useState } from "react";
import { BN, BN_THOUSAND, BN_TWO } from "@polkadot/util";
import { useMountedState } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import {
  blockTimeSelector,
  setBlockTime,
  setLatestHeight,
} from "../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import useCurrentBlockHeightAndTime from "./useCurrentBlockHeightAndTime";
import { estimateBlocksTime } from "..";
import { useScanHeight } from "next-common/hooks/scanHeight";

const DEFAULT_TIME = new BN(6_000);

export function useBlockTime(api) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!api) {
      return;
    }

    const THRESHOLD = BN_THOUSAND.div(BN_TWO);
    const blockTime =
      api.consts?.babe?.expectedBlockTime ||
      // POW, eg. Kulupu
      api.consts?.difficulty?.targetBlockTime ||
      // Subspace
      api.consts?.subspace?.expectedBlockTime ||
      // Check against threshold to determine value validity
      (api.consts?.timestamp?.minimumPeriod.gte(THRESHOLD)
        ? // Default minimum period config
          api.consts?.timestamp.minimumPeriod.mul(BN_TWO)
        : api.query?.parachainSystem
        ? // default guess for a parachain
          DEFAULT_TIME.mul(BN_TWO)
        : // default guess for others
          DEFAULT_TIME);
    if (blockTime) {
      dispatch(setBlockTime(blockTime.toNumber()));
    }
  }, [api, dispatch]);
}

export function useSubscribeChainHead(api) {
  const isMounted = useMountedState();
  const dispatch = useDispatch();
  useEffect(() => {
    if (api) {
      api.rpc.chain.subscribeNewHeads((header) => {
        const latestUnFinalizedHeight = header.number.toNumber();
        if (isMounted()) {
          dispatch(setLatestHeight(latestUnFinalizedHeight));
        }
      });
    }
  }, [api, dispatch, isMounted]);
}

export function useEstimateTimestampAtBlockHeight(blockHeight) {
  const [estimatedTime, setEstimatedTime] = useState();
  const blockTime = useSelector(blockTimeSelector);
  const [currentHeight, currentTimestamp] = useCurrentBlockHeightAndTime();

  useEffect(() => {
    if (!currentHeight || !currentTimestamp || !blockTime) {
      return;
    }
    const blocks = blockHeight - currentHeight;
    setEstimatedTime(
      new BigNumber(blockTime).times(blocks).plus(currentTimestamp).toNumber(),
    );
  }, [currentHeight, currentTimestamp, blockTime, blockHeight]);

  return estimatedTime;
}

export function useEstimateTimeFromNowToBlockHeight(blockHeight) {
  const currentHeight = useScanHeight();
  const result = useEstimateBlocksTime(blockHeight - currentHeight);
  if (!currentHeight) {
    return "";
  }
  return result;
}

export function useEstimateBlocksTime(blocks) {
  const blockTime = useSelector(blockTimeSelector);
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    setEstimatedTime(estimateBlocksTime(blocks, blockTime));
  }, [blockTime, blocks]);

  return estimatedTime;
}
