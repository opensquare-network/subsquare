import Checkbox from "next-common/components/checkbox";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";

// TODO: filter by checkbox, default checked all.
export const operationColumn = {
  name: "",
  style: { textAlign: "left", width: "60px" },
  render: () => <Checkbox checked={false} className="w-4 h-4" />,
};

export const rankColumn = {
  name: "Rank",
  style: { textAlign: "left", width: "60px" },
  render: (item) => <FellowshipRank rank={item.rank} />,
};

export const memberColumn = {
  name: "Member",
  style: { textAlign: "left" },
  render: (item) => <AddressUser add={item.address} key={item.address} />,
};
