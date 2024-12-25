import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";
import { isNil } from "lodash-es";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";

function FellowshipRankInfo({ address }) {
  const rank = useFellowshipMemberRank(address, "fellowshipCollective");

  if (isNil(rank)) {
    return null;
  }

  return <FellowshipRank rank={rank} />;
}

const rankColumn = {
  key: "rank",
  className: "w-[20px] block",
  style: { width: "20px" },
  render: (_, row) => <FellowshipRankInfo key={"rank"} address={row.address} />,
};

const addressColumn = {
  key: "address",
  className: "text-left",
  style: { minWidth: "140px" },
  render: (address) => <AddressUser add={address} />,
};

const ayeColumn = {
  key: "isAye",
  className: "text-left w-[140px]",
  render: (isAye) => {
    if (isNil(isAye)) {
      return <span className="text-textDisabled">-</span>;
    }

    return isAye ? (
      <span className="text-green500">Aye</span>
    ) : (
      <span className="text-red500">Nay</span>
    );
  },
};

const votesColumn = {
  key: "votes",
  className: "text-right w-[140px] align-right flex-end",
  render: (votes) => <span>{votes}</span>,
};

const columns = [rankColumn, addressColumn, ayeColumn, votesColumn];

export default columns;
