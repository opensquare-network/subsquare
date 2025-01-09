import { useMemo } from "react";
import Checkbox from "next-common/components/checkbox";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";

export default function useBatchBumpColumns(
  selected,
  toggleSelection,
  toggleAllSelection,
) {
  const allSelected = useMemo(
    () => Object.values(selected).every((v) => v),
    [selected],
  );

  return useMemo(
    () => [
      {
        name: "Rank",
        className: "text-left w-16",
        render: (item) => <FellowshipRank rank={item.rank} />,
      },
      {
        name: "Member",
        className: "text-left",
        render: (item) => <AddressUser add={item.address} key={item.address} />,
      },
      {
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
      },
    ],
    [selected, toggleSelection, toggleAllSelection, allSelected],
  );
}
