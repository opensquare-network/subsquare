import { useRef, useState, memo } from "react";
import Input from "next-common/lib/input";
import SearchInputShortcut from "./searchInputShortcut";
import { SystemSearch } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import useRefCallback from "next-common/hooks/useRefCallback";
import SearchPopup from "next-common/components/header/search/popup";

function SearchInputWithPopup({ shortcut = true, type }) {
  const [value, setValue] = useState("");
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const inputRef = useRef();
  const [focus, setFocus] = useState(false);

  const handleSearch = useRefCallback(() => {
    setShowSearchPopup(true);
  });

  return (
    <>
      <Input
        className={cn(
          "bg-neutral200 border-neutral200",
          "data-[focus]:bg-neutral100 data-[focus]:border-neutral500",
        )}
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search Referenda on SubSquare"
        onKeyDown={(event) => {
          if (event.code === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            handleSearch();
          }
        }}
        onFocus={() => {
          setFocus(true);
          setShowSearchPopup(true);
        }}
        onBlur={() => setFocus(false)}
        prefix={<SystemSearch className="[&_path]:fill-textTertiary" />}
        suffix={
          shortcut && (
            <SearchInputShortcut
              onKeyDown={(event) => {
                if (event.code === "Enter" || event.keyCode === 13) {
                  event.preventDefault();
                  handleSearch();
                }
              }}
              focus={focus}
              inputRef={inputRef}
            />
          )
        }
        type={type}
        enterKeyHint="Search"
      />
      {showSearchPopup && (
        <SearchPopup
          isMobile={!shortcut}
          onClose={() => setShowSearchPopup(false)}
        />
      )}
    </>
  );
}
export default memo(SearchInputWithPopup);
