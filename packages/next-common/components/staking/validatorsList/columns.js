import { AddressUser } from "../../user";
import ValueDisplay from "../../valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import SignalIndicator from "../../icons/signalIndicator";
import Tooltip from "../../tooltip";

export const colAccount = {
  name: "Account",
  style: { textAlign: "left", minWidth: "240px" },
  render: (item) => {
    return (
      <div className="flex items-center gap-2">
        <Tooltip content={item.isActive ? "Active" : "Inactive"}>
          <SignalIndicator
            className="w-[16px] h-[16px]"
            active={item.isActive}
          />
        </Tooltip>
        <AddressUser key="account" add={item.account} />
      </div>
    );
  },
};

export const colCommission = {
  name: "Commission",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  sortable: "asc",
  sortDirectionIcon: "right",
  render: (item) => (
    <span className="text-textPrimary">
      {(item.commission / 10000000).toFixed(2)}%
    </span>
  ),
};

function StakeValue({ value }) {
  const { symbol, decimals } = useChainSettings();
  if (value === undefined) {
    return <span className="text-textTertiary">-</span>;
  }
  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

export const colTotalStake = {
  name: "Total Stake",
  style: { textAlign: "right", width: "140px", minWidth: "140px" },
  sortable: "desc,asc",
  render: (item) => <StakeValue value={item.total} />,
};

function NominatorCount({ item }) {
  if (item.nominatorCount === undefined) {
    return <span className="text-textTertiary">-</span>;
  }
  return <span className="text-textPrimary">{item.nominatorCount}</span>;
}

export const colNominatorCount = {
  name: "Nominator Count",
  style: { textAlign: "left", width: "160px", minWidth: "160px" },
  sortable: "desc,asc",
  sortDirectionIcon: "right",
  render: (item) => <NominatorCount item={item} />,
};

export const colSelfStake = {
  name: "Self Stake",
  style: { textAlign: "left", width: "140px", minWidth: "140px" },
  sortable: "desc,asc",
  sortDirectionIcon: "right",
  render: (item) => <StakeValue value={item.own} />,
};
