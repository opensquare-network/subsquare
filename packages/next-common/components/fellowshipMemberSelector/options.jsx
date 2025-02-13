import { cn } from "next-common/utils";
import FellowshipRank from "../fellowship/rank";
import { AddressComboListItemAccount } from "next-common/components/addressCombo";

function SelectOptions({ members, address, onSelect, highlightedIndex }) {
  return (
    <div className="absolute w-full mt-1 bg-neutral100 shadow-200 border border-neutral300 rounded-md max-h-80 overflow-y-auto z-10 py-2">
      {members.map((item, index) => (
        <div
          key={item.address}
          className={cn(
            `option-item-${index}`,
            "w-full flex items-center gap-4 px-4 py-2 cursor-pointer",
            item.address === address && "bg-neutral200",
            index === highlightedIndex && "bg-neutral300",
          )}
          onClick={() => onSelect(item)}
        >
          <AddressComboListItemAccount account={item} />
          <div className="w-5 h-5 flex">
            <FellowshipRank rank={item.rank} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SelectOptions;
