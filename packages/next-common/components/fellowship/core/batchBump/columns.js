import Checkbox from "next-common/components/checkbox";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";
import { useState } from "react";

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

function SingleRowCheckBox({ onSelected, address, defaultValue }) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <Checkbox
      checked={selected}
      key={address}
      onClick={() => {
        onSelected(address, !selected);
        setSelected(!selected);
      }}
      className="w-4 h-4 cursor-pointer"
    />
  );
}

export const AllRowsCheckBox = ({
  onSelected,
  defaultValue,
  expiredMembers,
}) => {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <Checkbox
      checked={selected}
      onClick={() => {
        const newSelections = expiredMembers.reduce((acc, member) => {
          acc[member.address] = !selected;
          return acc;
        }, {});
        setSelected(!selected);
        onSelected(newSelections);
      }}
      className="w-4 h-4 cursor-pointer"
    />
  );
};

export const operationDesktopColumnFunc = (
  selected,
  onChange,
  expiredMembers,
  allSelected,
) => {
  return {
    name: (
      <AllRowsCheckBox
        expiredMembers={expiredMembers}
        defaultValue={allSelected}
        onSelected={(newSelections) => {
          onChange(newSelections);
        }}
      />
    ),
    className: "text-right w-16 inline-flex justify-end",
    render: (item) => (
      <SingleRowCheckBox
        address={item.address}
        defaultValue={selected[item.address]}
        key={item.address}
        onSelected={(address, isSelected) => {
          selected[address] = isSelected;
          onChange(selected);
        }}
      />
    ),
  };
};

export const operationMobileColumnFunc = (selected, onChange) => {
  return {
    name: "",
    className: "text-right w-12 inline-flex justify-end",
    render: (item) => (
      <SingleRowCheckBox
        address={item.address}
        defaultValue={selected[item.address]}
        onSelected={(address, isSelected) => {
          selected[address] = isSelected;
          onChange(selected);
        }}
      />
    ),
  };
};
