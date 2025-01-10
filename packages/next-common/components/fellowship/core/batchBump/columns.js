import Checkbox from "next-common/components/checkbox";
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

export const operationDesktopColumnFunc = (
  selected,
  toggleSelection,
  toggleAllSelection,
) => {
  const allSelected = Object.values(selected).every((v) => v);

  return {
    name: (
      <Checkbox
        checked={allSelected}
        onClick={() => toggleAllSelection(allSelected)}
        className="w-4 h-4 cursor-pointer"
      />
    ),
    className: "text-right w-16 inline-flex justify-end",
    render: (item) => (
      <Checkbox
        checked={selected[item.address]}
        onClick={() => toggleSelection(item.address)}
        className="w-4 h-4 cursor-pointer"
      />
    ),
  };
};

export const operationMobileColumnFunc = (selected, toggleSelection) => {
  return {
    name: "",
    className: "text-right w-12 inline-flex justify-end",
    render: (item) => (
      <Checkbox
        checked={selected[item.address]}
        onClick={() => toggleSelection(item.address)}
        className="w-4 h-4 cursor-pointer"
      />
    ),
  };
};
