import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

function Balance({ value }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <ValueDisplay
      key="value"
      value={toPrecision(value, decimals)}
      symbol={symbol}
    />
  );
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
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  render: ({ startingBlock }) => <div>{startingBlock}</div>,
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

const columns = [
  addressColumn,
  startingBlockColumn,
  perBlockColumn,
  lockedColumn,
];

export default columns;
