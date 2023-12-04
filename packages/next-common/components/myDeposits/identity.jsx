import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { DepositTitle } from "next-common/components/myDeposits/depositTemplate";
import { MenuIdentity } from "@osn/icons/subsquare";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useIdentityDeposit from "next-common/hooks/useIdentityDeposit";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";
import { toPrecisionNumber } from "next-common/utils";

function AddressIdentityDeposit({ address }) {
  const deposit = useIdentityDeposit(address);
  const { decimals, symbol } = useChainSettings();

  if (!deposit) {
    return null;
  }

  return (
    <SecondaryCard>
      <div className="flex items-center justify-between">
        <DepositTitle title="Identity" icon={<MenuIdentity />} />
        <ValueDisplay
          className="text-textSecondary text14Medium leading-[20px]"
          value={toPrecisionNumber(deposit, decimals)}
          symbol={symbol}
        />
      </div>
    </SecondaryCard>
  );
}

export default function IdentityDeposit() {
  const address = useRealAddress();

  if (!address) {
    return null;
  }

  return <AddressIdentityDeposit address={address} />;
}
