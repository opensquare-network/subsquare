import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import AddressUser from "next-common/components/user/addressUser";
import { toPrecision } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import DetailButton from "next-common/components/detailButton";

export function Balance({
  value,
  className = "",
  showTooltip = true,
  showSymbol = true,
}) {
  const { decimals, symbol } = useChainSettings();

  return (
    <ValueDisplay
      value={toPrecision(value, decimals)}
      symbol={showSymbol ? symbol : null}
      className={className}
      showTooltip={showTooltip}
    />
  );
}

function BalanceColumn({ currentBalanceInLock, totalVesting }) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="text-textPrimary text14Medium">
        <Tooltip content="Current Balance in Lock">
          <Balance
            value={currentBalanceInLock}
            showTooltip={false}
            showSymbol={false}
          />
        </Tooltip>
        <span className="mx-1 text-textTertiary">/</span>
        <Tooltip content="Total Balance by Vesting">
          <Balance value={totalVesting} showTooltip={false} />
        </Tooltip>
      </div>
    </div>
  );
}

function ActionColumn({ onCheckDetail }) {
  return (
    <Tooltip content="Show All Schedules">
      <DetailButton onClick={onCheckDetail} />
    </Tooltip>
  );
}

export const columns = [
  {
    name: "Account",
    style: { textAlign: "left", minWidth: "240px" },
    render: (item) => <AddressUser add={item.account} key={item.account} />,
  },
  {
    name: "Balance",
    style: { textAlign: "left", minWidth: "240px" },
    render: (item) => (
      <BalanceColumn
        currentBalanceInLock={item.currentBalanceInLock}
        totalVesting={item.totalVesting}
      />
    ),
  },
  {
    name: "Unlockable",
    style: { textAlign: "left", minWidth: "180px" },
    render: (item) => <Balance value={item.unlockable} />,
  },
  {
    name: "Actions",
    style: { textAlign: "right", width: "120px" },
    render: (item) => <ActionColumn onCheckDetail={item.onCheckDetail} />,
  },
];
