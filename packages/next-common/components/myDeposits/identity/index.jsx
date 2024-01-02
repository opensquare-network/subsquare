import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { DepositTitle } from "next-common/components/myDeposits/depositTemplate";
import { MenuIdentity } from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber } from "next-common/utils";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";
import ValueDisplay from "../../valueDisplay";
import AccordionCard from "../../styled/containers/accordionCard";
import DataList from "next-common/components/dataList";
import SubIdentityUser from "../../user/subIdentityUser";
import { AddressUser } from "../../user";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function DepositList() {
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
        className="text14Medium text-textPrimary"
        value={toPrecisionNumber(identityDeposit, decimals)}
        symbol={symbol}
      />,
    ],
    ...(subs || []).map(([address], index) => [
      <SubIdentityUser key={`address-sub-${index}`} add={address} />,
      <ValueDisplay
        key={`deposit-sub-${index}`}
        className="text14Medium text-textPrimary"
        value={toPrecisionNumber(averageSubDeposit, decimals)}
        symbol={symbol}
      />,
    ]),
  ];

  return <DataList columns={columns} rows={rows} noDataText="No items" />;
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
