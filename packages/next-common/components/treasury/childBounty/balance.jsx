import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { Value } from "next-common/components/referenda/tally/styled";
import SymbolValue from "next-common/components/pages/components/gov2/sidebar/tally/values/symbolValue";
import { useOnchainData } from "next-common/context/post";
import useSubAddressBalanceWithPapi from "next-common/utils/hooks/useSubAddressBalanceWithPapi";
import { InfoUser, SystemCoins } from "@osn/icons/subsquare";
import {
  CardDetailTitle,
  CardDetailRow,
  CopyableAddress,
} from "next-common/components/treasury/bounty/balance";

function ChildBountySidebarBalance() {
  const { address } = useOnchainData();
  const { balance, isLoading } = useSubAddressBalanceWithPapi(address);

  if (!address) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <CardDetailTitle title="Balance" />
      <CardDetailRow
        icon={<SystemCoins />}
        title="Balance"
        value={<SymbolValue value={balance} />}
        isLoading={isLoading}
      />
      <CardDetailRow
        icon={<InfoUser />}
        title="Address"
        value={
          <Value>
            <CopyableAddress address={address} />
          </Value>
        }
      />
    </SecondaryCardDetail>
  );
}

export default ChildBountySidebarBalance;
