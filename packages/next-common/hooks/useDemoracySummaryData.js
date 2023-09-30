import { useEffect, useState } from "react";
import useApi from "../utils/hooks/useApi";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../store/reducers/chainSlice";
import { useChain } from "../context/chain";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

async function referendumsActive(api) {
  if (!api) {
    return [];
  }
  const ids = await api.derive.democracy?.referendumIds();
  const referendumInfos = await api.query.democracy?.referendumInfoOf.multi(
    ids,
  );
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
  const blockHeight = useSelector(chainOrScanHeightSelector);

  useEffect(() => {
    if (!api) {
      return;
    }

    Promise.all([
      api.query.democracy?.publicProps(),
      referendumsActive(api),
      api?.query.democracy?.publicPropCount(),
      api?.query.democracy?.referendumCount(),
    ]).then(
      ([
        activeProposals,
        activeReferendums,
        publicPropCountResponse,
        referendumCountResponse,
      ]) => {
        setSummary({
          ...summary,
          activeProposalsCount: activeProposals?.length,
          referendumCount: (activeReferendums || []).length,
          publicPropCount: publicPropCountResponse?.toJSON() || 0,
          referendumTotal: referendumCountResponse?.toJSON() || 0,
        });
      },
    );
  }, [chain, api, blockTime, blockHeight]);

  return summary;
}
