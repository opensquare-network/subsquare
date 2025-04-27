import { cn } from "next-common/utils";
import Input from "next-common/lib/input";
import React, { useEffect } from "react";
import { SystemSearch, SystemClose } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import useInsideSearchSupportCategories from "next-common/components/header/hooks/useInsideSearchSupportCategories";

const InputInSearchPopup = React.memo(function InputInSearchPopup({
  className = "",
  searchValue,
  onClose = () => {},
  setSearchValue,
}) {
  const inputRef = React.useRef(null);
  const { categoryString } = useInsideSearchSupportCategories();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Input
      className={cn(
        "border-none",
        "focus:border-none",
        "focus:ring-0",
        "h-[40px]",
        className,
      )}
      ref={inputRef}
      value={searchValue}
      onChange={(e) => {
        setSearchValue(e.target.value);
      }}
      placeholder={`Search ${categoryString} on SubSquare`}
      prefix={<SystemSearch className="[&_path]:fill-textTertiary" />}
      suffix={
        <SecondaryButton
          size="small"
          className="border-0 w-10 h-10"
          onClick={() => {
            onClose();
            setSearchValue("");
          }}
        >
          <SystemClose className="w-5 h-5 [&_path]:fill-textTertiary" />
        </SecondaryButton>
      }
      enterKeyHint="Search"
    />
  );
});

export default InputInSearchPopup;
