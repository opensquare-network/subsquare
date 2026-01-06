import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import AddressUser from "next-common/components/user/addressUser";
import { toPrecision } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import DetailButton from "next-common/components/detailButton";
import SortableColumn from "next-common/components/styledList/sortableColumn";
import VestAction from "./vestAction";

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

function SchedulesCountColumn({ count, onClick }) {
  return (
    <span
      role="button"
      onClick={onClick}
      className="text-textPrimary text14Medium cursor-pointer hover:text-theme500"
    >
      {count}
    </span>
  );
}

function ActionColumn({ onClick, account, unlockable }) {
  return (
    <div className="flex items-center justify-end gap-x-4">
      <Tooltip content="Show All Schedules">
        <DetailButton onClick={onClick} />
      </Tooltip>
      <VestAction account={account} unlockable={unlockable} />
    </div>
  );
}

export function getColumns({ sortField, sortDirection, onSort }) {
  return [
    {
      name: "Account",
      style: { textAlign: "left", minWidth: "240px" },
      render: (item) => <AddressUser add={item.account} key={item.account} />,
    },
    {
      name: (
        <SortableColumn
          name="Balance"
          sortDirection={sortDirection}
          sorted={sortField === "currentBalanceInLock"}
          onClick={() => onSort("currentBalanceInLock")}
        />
      ),
      style: { textAlign: "left", minWidth: "240px" },
      render: (item) => (
        <BalanceColumn
          currentBalanceInLock={item.currentBalanceInLock}
          totalVesting={item.totalVesting}
        />
      ),
    },
    {
      name: "Schedules",
      style: { textAlign: "left", minWidth: "100px" },
      render: (item) => (
        <SchedulesCountColumn
          count={item.schedulesCount}
          onClick={item.onCheckDetail}
        />
      ),
    },
    {
      name: (
        <SortableColumn
          name="Unlockable"
          sortDirection={sortDirection}
          sorted={sortField === "unlockable"}
          onClick={() => onSort("unlockable")}
        />
      ),
      style: { textAlign: "left", minWidth: "180px" },
      render: (item) => <Balance value={item.unlockable} />,
    },
    {
      name: "Actions",
      style: { textAlign: "right", width: "120px" },
      render: (item) => (
        <ActionColumn
          onClick={item.onCheckDetail}
          account={item.account}
          unlockable={item.unlockable}
        />
      ),
    },
  ];
}
