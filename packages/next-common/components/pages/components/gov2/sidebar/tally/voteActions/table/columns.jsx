import AddressUser from "next-common/components/user/addressUser";
import ExplorerLink from "next-common/components/links/explorerLink";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";

const OPENGOV_VOTE_ACTION_TYPES = {
  1: "Vote",
  2: "Remove Vote",
  3: "Delegate",
  4: "Remove Delegation",
};

function ActionField({ type, indexer }) {
  return (
    <div className="flex flex-col">
      <div className="text-textPrimary text14Medium">
        {OPENGOV_VOTE_ACTION_TYPES[type]}
      </div>
      <ExplorerLink indexer={indexer}>
        <div className="text-textTertiary hover:underline">
          <span>{formatDateTime(indexer?.blockTime)}</span>
          <span>&nbsp;↗</span>
        </div>
      </ExplorerLink>
    </div>
  );
}

const accountColumn = {
  name: "Account",
  width: 224,
  render({ who }) {
    return <AddressUser key="user" add={who} />;
  },
};

const actionColumn = {
  name: "Action",
  width: 200,
  className: "text-left",
  render({ type, indexer }) {
    return <ActionField type={type} indexer={indexer} />;
  },
};

// TODO: detail
const detailColumn = {
  name: "Detail",
  // width: 200,
  className: "text-right",
  render() {
    return <div>details</div>;
  },
};

// TODO: impact
const impactColumn = {
  name: "Impact",
  width: 160,
  className: "text-right",
  render() {
    return <div>+ 600 VOTES</div>;
  },
};

export const columns = [
  accountColumn,
  actionColumn,
  detailColumn,
  impactColumn,
];
