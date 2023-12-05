import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { DepositTitle } from "next-common/components/myDeposits/depositTemplate";
import { MenuIdentity } from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber } from "next-common/utils";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import ValueDisplay from "../../valueDisplay";
import AccordionCard from "../../styled/containers/accordionCard";
import MobileList from "./mobile";
import DesktopList from "./desktop";

function DepositList() {
  const { sm } = useScreenSize();
  return sm ? <MobileList /> : <DesktopList />;
}

export default function IdentityDeposit() {
  const { depositsCount, totalDeposit } = useMyIdentityDeposit();
  const { decimals, symbol } = useChainSettings();

  const title = (
    <DepositTitle
      title="Identity"
      icon={<MenuIdentity />}
      extra={
        <span className="text14Medium text-textTertiary ml-1">
          {depositsCount}
        </span>
      }
    />
  );

  const extra = (
    <ValueDisplay
      className="text-textSecondary text14Medium leading-[20px]"
      value={toPrecisionNumber(totalDeposit, decimals)}
      symbol={symbol}
    />
  );

  if (!depositsCount) {
    return <SecondaryCard>{title}</SecondaryCard>;
  }

  return (
    <AccordionCard title={title} extra={extra} defaultOpen>
      <DepositList />
    </AccordionCard>
  );
}
