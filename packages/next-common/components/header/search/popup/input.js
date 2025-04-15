import { cn } from "next-common/utils";
import Input from "next-common/lib/input";
import React from "react";
import { SystemSearch } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";

const InputInSearchPopup = React.memo(function InputInSearchPopup({
  className = "",
  searchValue,
  onClose = () => {},
  setSearchValue,
  handleSearch,
}) {
  return (
    <Input
      className={cn(
        "border-none",
        "focus:border-none",
        "focus:ring-0",
        "h-[40px]",
        className,
      )}
      value={searchValue}
      onChange={(e) => {
        setSearchValue(e.target.value);
      }}
      placeholder="Search Referenda on SubSquare"
      onKeyDown={(event) => {
        if (event.code === "Enter" || event.keyCode === 13) {
          event.preventDefault();
          handleSearch();
        }
      }}
      prefix={<SystemSearch className="[&_path]:fill-textTertiary" />}
      suffix={
        <SecondaryButton
          size="small"
          onClick={() => {
            onClose();
            setSearchValue("");
          }}
        >
          ESC
        </SecondaryButton>
      }
      enterKeyHint="Search"
    />
  );
});

export default InputInSearchPopup;
