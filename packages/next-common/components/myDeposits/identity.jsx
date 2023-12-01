import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { DepositTitle } from "next-common/components/myDeposits/depositTemplate";
import { MenuIdentity } from "@osn/icons/subsquare";

export default function IdentityDeposit() {
  return (
    <SecondaryCard>
      <div className="flex justify-between">
        <DepositTitle title="Identity" icon={<MenuIdentity />} />
      </div>
    </SecondaryCard>
  );
}
