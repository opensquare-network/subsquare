import { SystemSearch } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function SearchBtn({ showSearch, setShowSearch, setSearch }) {
  return (
    <div
      className={cn(
        "cursor-pointer",
        showSearch
          ? "[&_path]:fill-textSecondary"
          : "[&_path]:fill-textTertiary",
      )}
      role="button"
      onClick={() => {
        const show = !showSearch;
        setShowSearch(show);
        if (!show) {
          setSearch("");
        }
      }}
    >
      <SystemSearch width={20} height={20} />
    </div>
  );
}
