import { useMemo } from "react";
import Checkbox from "next-common/components/checkbox";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";

export default function useBatchBumpColumns(selected, toggleSelection) {
  return useMemo(
    () => [
      // TODO: toggle all into tableList
      {
        name: "",
        style: { textAlign: "left", width: "60px" },
        render: (item) => (
          <Checkbox
            checked={selected[item.address]}
            onClick={() => toggleSelection(item.address)}
            className="w-4 h-4 cursor-pointer"
          />
        ),
      },
      {
        name: "Rank",
        style: { textAlign: "left", width: "60px" },
        render: (item) => <FellowshipRank rank={item.rank} />,
      },
      {
        name: "Member",
        style: { textAlign: "left" },
        render: (item) => <AddressUser add={item.address} key={item.address} />,
      },
    ],
    [selected, toggleSelection],
  );
}
