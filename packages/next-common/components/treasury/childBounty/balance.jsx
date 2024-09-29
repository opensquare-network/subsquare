import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { Value } from "next-common/components/referenda/tally/styled";
import SymbolValue from "components/gov2/sidebar/tally/values/symbolValue";
import { useOnchainData } from "next-common/context/post";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";
import { InfoUser, SystemCoins } from "@osn/icons/subsquare";
import {
  CardDetailTitle,
  CardDetailRow,
  CopyableAddress,
} from "next-common/components/treasury/bounty/balance";

function ChildBountySidebarBalance() {
  const { address } = useOnchainData();
  const { balance, isLoading } = useSubAddressBalance(address);

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
