import { SystemSearch } from "@osn/icons/subsquare";

export default function SearchBtn({ showSearch, setShowSearch, setSearch }) {
  return (
    <div
      className={
        showSearch
          ? "[&_path]:fill-textSecondary"
          : "[&_path]:fill-textTertiary"
      }
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
