import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { DepositTitle } from "next-common/components/myDeposits/depositTemplate";
import { MenuIdentity } from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";
import { toPrecisionNumber } from "next-common/utils";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";

export default function IdentityDeposit() {
  const { depositsCount, totalDeposit } = useMyIdentityDeposit();
  const { decimals, symbol } = useChainSettings();

  if (!depositsCount) {
    return null;
  }

  return (
    <SecondaryCard>
      <div className="flex items-center justify-between">
        <DepositTitle
          title="Identity"
          icon={<MenuIdentity />}
          extra={
            <span className="text14Medium text-textTertiary ml-1">
              {depositsCount}
            </span>
          }
        />
        <ValueDisplay
          className="text-textSecondary text14Medium leading-[20px]"
          value={toPrecisionNumber(totalDeposit, decimals)}
          symbol={symbol}
        />
      </div>
    </SecondaryCard>
  );
}
