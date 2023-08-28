import { SystemSearch } from "@osn/icons/subsquare";
import clsx from "clsx";

export default function SearchBtn({ showSearch, setShowSearch, setSearch }) {
  return (
    <div
      className={clsx(
        "cursor-pointer",
        showSearch
          ? "[&_path]:fill-textSecondary"
          : "[&_path]:fill-textTertiary",
      )}
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
