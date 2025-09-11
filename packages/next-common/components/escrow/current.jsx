import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import useEscrowTotalSupply from "next-common/hooks/escrow/useEscrowTotalSupply";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import useEscrowLocked from "next-common/hooks/escrow/useEscrowLocked";

export default function Current() {
  const supply = useEscrowTotalSupply();
  const { symbol, voteSymbol, decimals } = useChainSettings();
  const lockedData = useEscrowLocked();
  const { totalStaked, totalAccount } = lockedData || {};

  return (
    <>
      <TitleContainer>Current</TitleContainer>
      <SecondaryCard>
        <SummaryLayout>
          <SummaryItem title="Total Supply">
            <LoadableContent isLoading={isNil(supply)}>
              <ValueDisplay
                value={toPrecision(supply, decimals, 0)}
                symbol={voteSymbol}
              />
            </LoadableContent>
          </SummaryItem>
          <SummaryItem title="Total Staked">
            <LoadableContent isLoading={isNil(totalStaked)}>
              <ValueDisplay
                value={toPrecision(totalStaked, decimals, 0)}
                symbol={symbol}
              />
            </LoadableContent>
          </SummaryItem>
          <SummaryItem title="Total Accounts">
            <LoadableContent isLoading={isNil(totalAccount)}>
              <ValueDisplay value={totalAccount} />
            </LoadableContent>
          </SummaryItem>
        </SummaryLayout>
      </SecondaryCard>
    </>
  );
}
