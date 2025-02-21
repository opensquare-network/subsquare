import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import Tooltip from "next-common/components/tooltip";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";

function Balance({ value, className = "" }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <ValueDisplay
      key="value"
      value={toPrecision(value, decimals)}
      symbol={symbol}
      className={className}
    />
  );
}

function StartingBlock({ startingBlock }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const content = startingBlock.toLocaleString();

  if (isNil(latestHeight) || startingBlock > latestHeight) {
    return <Tooltip content="Not started">{content}</Tooltip>;
  }

  return <div className="text-theme500">{content}</div>;
}

const addressColumn = {
  key: "address",
  name: "Address",
  className: "text-left",
  render: ({ address }) => <AddressUser add={address} />,
};

const startingBlockColumn = {
  key: "startingBlock",
  name: "Starting Block",
  style: { textAlign: "right", width: "120px", minWidth: "120px" },
  render: ({ startingBlock }) => (
    <StartingBlock startingBlock={startingBlock} />
  ),
};

const perBlockColumn = {
  key: "perBlock",
  name: "Per Block",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: ({ perBlock }) => <Balance value={perBlock} />,
};

const lockedColumn = {
  key: "locked",
  name: "Locked",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: ({ locked }) => <Balance value={locked} />,
};

const desktopUnlockableColumn = {
  key: "unlockable",
  name: "Unlockable",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: ({ unlockableBalance, unlockablePercentage }) => (
    <Tooltip content={<Balance value={unlockableBalance} />}>
      {unlockablePercentage}%
    </Tooltip>
  ),
};

const mobileUnlockableColumn = {
  key: "unlockable",
  name: "Unlockable",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: ({ unlockableBalance, unlockablePercentage }) => (
    <div className="flex flex-wrap flex-col items-end">
      <p>{unlockablePercentage}%</p>
      {Number(unlockablePercentage) !== 0 && (
        <Balance
          value={unlockableBalance}
          className="text12Medium text-textTertiary"
        />
      )}
    </div>
  ),
};

export const desktopColumns = [
  addressColumn,
  lockedColumn,
  startingBlockColumn,
  perBlockColumn,
  desktopUnlockableColumn,
];

export const mobileColumns = [
  addressColumn,
  lockedColumn,
  startingBlockColumn,
  perBlockColumn,
  mobileUnlockableColumn,
];
