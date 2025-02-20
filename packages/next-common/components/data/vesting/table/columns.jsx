import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import Tooltip from "next-common/components/tooltip";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { useChain } from "next-common/context/chain";
import Link from "next/link";

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

function StartingBlock({ startingBlock }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const content = startingBlock.toLocaleString();
  const currentChain = useChain();

  if (isNil(latestHeight) || startingBlock > latestHeight) {
    return <Tooltip content="Not started">{content}</Tooltip>;
  }

  const domain = `https://${currentChain}.statescan.io/#`;

  return (
    <Link className="text-theme500" href={`${domain}/blocks/${startingBlock}`}>
      {content}
    </Link>
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

const columns = [
  addressColumn,
  startingBlockColumn,
  perBlockColumn,
  lockedColumn,
];

export default columns;
