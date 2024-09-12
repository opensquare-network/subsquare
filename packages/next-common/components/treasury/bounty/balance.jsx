import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import SymbolValue from "components/gov2/sidebar/tally/values/symbolValue";
import { useOnchainData } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import { InfoDocs, SystemCoins } from "@osn/icons/subsquare";

function BountySidebarBalance() {
  const { address } = useOnchainData();
  const { balance, isLoading } = useSubAddressBalance(address);
  const { childBounties } = usePageProps();

  if (!address) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <TitleContainer className="mb-4 !px-0">
        <span>Balance</span>
        {isLoading && (
          <div>
            <Loading size={16} />
          </div>
        )}
      </TitleContainer>
      <BorderedRow>
        <Header>
          <div>
            <SystemCoins className="w-[20px] h-[20px] text-textTertiary" />
          </div>
          Balance
        </Header>
        {isLoading ? <Value>-</Value> : <SymbolValue value={balance} />}
      </BorderedRow>
      <BorderedRow>
        <Header>
          <div>
            <InfoDocs className="w-[20px] h-[20px] text-textTertiary" />
          </div>
          Child Bounties
        </Header>
        <Value>{childBounties?.total || 0}</Value>
      </BorderedRow>
    </SecondaryCardDetail>
  );
}

export default BountySidebarBalance;
