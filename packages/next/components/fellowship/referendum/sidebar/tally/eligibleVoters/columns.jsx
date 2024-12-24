import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";

const rankColumn = {
  key: "rank",
  className: "w-[20px] block",
  style: { width: "20px" },
  render: (rank) => <FellowshipRank rank={rank} />,
};

const addressColumn = {
  key: "address",
  className: "text-left",
  style: { minWidth: "140px" },
  render: (address) => <AddressUser add={address} />,
};

const ayeColumn = {
  key: "aye",
  className: "text-left w-[140px]",
  render: (aye) => {
    if (aye === 1) {
      return <span className="text-green500">Aye</span>;
    }

    if (aye === 0) {
      return <span className="text-red500">Nay</span>;
    }

    return <span className="text-textDisabled">-</span>;
  },
};

const votesColumn = {
  key: "votes",
  className: "text-right w-[140px] align-right flex-end",
  render: (votes) => <span>{votes}</span>,
};

const columns = [rankColumn, addressColumn, ayeColumn, votesColumn];

export default columns;
