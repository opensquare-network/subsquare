import { useChainSettings } from "next-common/context/chain";
import { toPrecisionNumber } from "next-common/utils";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";
import ValueDisplay from "../../valueDisplay";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { AddressUser } from "../../user";
import SubIdentityUser from "../../user/subIdentityUser";

function Items({ rows }) {
  return rows.map(([address, deposit], index) => {
    return (
      <div
        key={index}
        className="flex flex-col gap-[12px] py-[16px] border-b border-neutral300"
      >
        {address}
        <div className="flex justify-between items-center">
          <span className="text-textSecondary text14Medium leading-[20px]">
            Deposit Balance
          </span>
          {deposit}
        </div>
      </div>
    );
  });
}

export default function MobileList() {
  const address = useRealAddress();
  const { identityDeposit, subs, averageSubDeposit } = useMyIdentityDeposit();
  const { decimals, symbol } = useChainSettings();

  const rows = [
    [
      <AddressUser key="address-main" add={address} fontSize={16} />,
      <ValueDisplay
        key="deposit"
        className="text14Medium"
        value={toPrecisionNumber(identityDeposit, decimals)}
        symbol={symbol}
      />,
    ],
    ...(subs || []).map(([address], index) => [
      <SubIdentityUser
        key={`address-sub-${index}`}
        add={address}
        fontSize={16}
      />,
      <ValueDisplay
        key={`deposit-sub-${index}`}
        className="text14Medium"
        value={toPrecisionNumber(averageSubDeposit, decimals)}
        symbol={symbol}
      />,
    ]),
  ];

  return <Items rows={rows} />;
}
