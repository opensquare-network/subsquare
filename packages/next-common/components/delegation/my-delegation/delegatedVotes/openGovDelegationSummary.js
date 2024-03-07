import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { toPrecision } from "next-common/utils";
import { useSelector } from "react-redux";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export default function OpenGovDelegationSummary() {
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { decimals, symbol } = useChainSettings();
  const totalDelegated = delegations
    ?.reduce((acc, { votes }) => acc.plus(votes), new BigNumber(0))
    .toString();

  const isLoading = !delegations;

  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "Tracks",
            content: (
              <LoadableContent isLoading={isLoading}>
                <CountSummaryContent count={delegations?.length || 0} />
              </LoadableContent>
            ),
          },
          {
            title: "Delegated Votes",
            content: (
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay
                  value={toPrecision(totalDelegated || 0, decimals)}
                  symbol={symbol}
                />
              </LoadableContent>
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
