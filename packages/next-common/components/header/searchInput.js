import { useRef, useState } from "react";
import Input from "next-common/lib/input";
import { useChain } from "../../context/chain";
import SearchInputShortcut from "./searchInputShortcut";
import { SystemSearch } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

const googleq = "https://google.com/search?q=";

export default function SearchInput({ shortcut = true, type }) {
  const chain = useChain();
  const [value, setValue] = useState("");
  const inputRef = useRef();
  const [focus, setFocus] = useState(false);

  const website = `https://${chain}.subsquare.io`;

  function handleSearch() {
    const params = encodeURIComponent(value + ` site:${website}`);
    const url = googleq + params;
    window.open(url, "_blank");
  }

  return (
    <Input
      className={cn(
        "bg-neutral200 border-neutral200",
        "data-[focus]:bg-neutral100 data-[focus]:border-neutral500",
      )}
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search on SubSquare"
      onKeyDown={(event) => {
        if (event.code === "Enter" || event.keyCode === 13) {
          event.preventDefault();
          handleSearch();
        }
      }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      prefix={<SystemSearch className="[&_path]:fill-textTertiary" />}
      suffix={
        shortcut && <SearchInputShortcut focus={focus} inputRef={inputRef} />
      }
      type={type}
      enterKeyHint="Search"
    />
  );
}
