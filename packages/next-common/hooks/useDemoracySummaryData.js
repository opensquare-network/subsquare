import { useEffect, useState } from "react";
import useApi from "../utils/hooks/useApi";
import { estimateBlocksTime } from "../utils";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { useChain } from "../context/chain";

async function referendumsActive(api) {
  if (!api) {
    return [];
  }
  const ids = await api.derive.democracy?.referendumIds();
  const referendumInfos = await api.query.democracy?.referendumInfoOf.multi(ids);
  return (referendumInfos || []).filter((referendumInfo) => {
    const info = referendumInfo.toJSON();
    return info?.ongoing;
  });
}

export function useDemocracySummaryData(defaultSummaryData = {}) {
  const chain = useChain();
  const [summary, setSummary] = useState(defaultSummaryData || {});
  const api = useApi();
  const blockTime = useSelector(blockTimeSelector);
  const blockHeight = useSelector(latestHeightSelector);

  const getLaunchPeriod = async function () {
    if (api && blockHeight && api.consts.democracy?.launchPeriod) {
      const launchPeriod = api.consts.democracy.launchPeriod.toNumber();
      const goneBlocks = new BigNumber(blockHeight)
        .mod(launchPeriod)
        .toNumber();
      const progress = new BigNumber(goneBlocks)
        .div(launchPeriod)
        .multipliedBy(100)
        .toNumber();
      const TimeArray = estimateBlocksTime(
        launchPeriod - goneBlocks,
        blockTime,
      );
      return {
        progress,
        launchPeriod: TimeArray,
        totalPeriod: ["/"].concat(estimateBlocksTime(launchPeriod, blockTime)),
      };
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    Promise.all([
      api.query.democracy?.publicProps(),
      referendumsActive(api),
      api?.query.democracy?.publicPropCount(),
      api?.query.democracy?.referendumCount(),
      getLaunchPeriod(),
      api?.query.democracy?.nextLaunchTimestamp?.(),
    ]).then(
      ([
        activeProposals,
        activeReferendums,
        publicPropCountResponse,
        referendumCountResponse,
        period,
        nextLaunchTimestampResponse,
      ]) => {
        setSummary({
          ...summary,
          activeProposalsCount: activeProposals?.length,
          referendumCount: (activeReferendums || []).length,
          publicPropCount: publicPropCountResponse?.toJSON() || 0,
          referendumTotal: referendumCountResponse?.toJSON() || 0,
          ...period,
          nextLaunchTimestamp: nextLaunchTimestampResponse?.toJSON?.(),
        });
      },
    );
  }, [chain, api, blockTime, blockHeight]);

  return summary;
}
