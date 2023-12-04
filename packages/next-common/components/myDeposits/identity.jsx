import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { DepositTitle } from "next-common/components/myDeposits/depositTemplate";
import { MenuIdentity } from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";
import { toPrecisionNumber } from "next-common/utils";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";
import AccordionCard from "../styled/containers/accordionCard";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import StyledList from "../styledList";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { AddressUser } from "../user";
import SubIdentityUser from "../user/subIdentityUser";

function MobileList() {
  return null;
}

function DesktopList() {
  const address = useRealAddress();
  const { identityDeposit, subs, averageSubDeposit } = useMyIdentityDeposit();
  const { decimals, symbol } = useChainSettings();

  const columns = [
    {
      name: "Address",
      style: { width: 176, textAlign: "left" },
    },
    {
      name: "Deposit Balance",
      style: { width: 168, textAlign: "right" },
    },
  ];
  const rows = [
    [
      <AddressUser key="address-main" add={address} />,
      <ValueDisplay
        key="deposit"
        value={toPrecisionNumber(identityDeposit, decimals)}
        symbol={symbol}
      />,
    ],
    ...(subs || []).map(([address], index) => [
      <SubIdentityUser key={`address-sub-${index}`} add={address} />,
      <ValueDisplay
        key={`deposit-sub-${index}`}
        value={toPrecisionNumber(averageSubDeposit, decimals)}
        symbol={symbol}
      />,
    ]),
  ];

  return (
    <StyledList
      className="!shadow-none !border-none !p-0"
      columns={columns}
      loading={false}
      rows={rows}
      noDataText="No items"
    />
  );
}

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
