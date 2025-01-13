import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";

export const rankColumn = {
  name: "Rank",
  className: "text-left w-16",
  render: (item) => <FellowshipRank rank={item.rank} />,
};

export const memberColumn = {
  name: "Member",
  className: "text-left",
  render: (item) => <AddressUser add={item.address} key={item.address} />,
};
