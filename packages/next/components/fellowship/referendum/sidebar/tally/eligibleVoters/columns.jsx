import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";
import { isNil } from "lodash-es";
import { useFellowshipMemberRank } from "next-common/hooks/fellowship/useFellowshipMemberRank";

function FellowshipRankInfo({ address }) {
  const rank = useFellowshipMemberRank(address, "fellowshipCollective");

  return <FellowshipRank rank={rank} />;
}

const rankColumn = {
  key: "rank",
  className: "w-5",
  render: (_, row) => (
    <div className="w-5 h-5">
      <FellowshipRankInfo address={row.address} />
    </div>
  ),
};

const addressColumn = {
  key: "address",
  className: "text-left min-w-[140px]",
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
