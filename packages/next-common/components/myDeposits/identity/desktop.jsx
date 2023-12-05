import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber } from "next-common/utils";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";
import ValueDisplay from "../../valueDisplay";
import StyledList from "../../styledList";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { AddressUser } from "../../user";
import SubIdentityUser from "../../user/subIdentityUser";

export default function DesktopList() {
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
        className="text14Medium"
        value={toPrecisionNumber(identityDeposit, decimals)}
        symbol={symbol}
      />,
    ],
    ...(subs || []).map(([address], index) => [
      <SubIdentityUser key={`address-sub-${index}`} add={address} />,
      <ValueDisplay
        key={`deposit-sub-${index}`}
        className="text14Medium"
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
