import { ArrowDown } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { OptionsPadRightWrapper } from "../select/styled";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

function DropdownPanel({ onClick, children }) {
  return (
    <OptionsPadRightWrapper onClick={onClick}>
      {children}
    </OptionsPadRightWrapper>
  );
}

export default function SplitButton({
  loading,
  disabled,
  dropdownContent,
  children,
  ...props
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef();
  useClickAway(ref, () => setShowDropdown(false));

  if (loading) {
    return (
      <PrimaryButton loading={loading} {...props}>
        {children}
      </PrimaryButton>
    );
  }

  return (
    <div className="flex gap-[1px]">
      <PrimaryButton
        disabled={disabled}
        {...props}
        className="rounded-tr-none rounded-br-none"
      >
        {children}
      </PrimaryButton>
      <div ref={ref} className="relative">
        <PrimaryButton
          disabled={disabled}
          {...props}
          className="rounded-tl-none rounded-bl-none p-[8px]"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <ArrowDown width={24} height={24} />
        </PrimaryButton>
        {showDropdown && (
          <DropdownPanel onClick={() => setShowDropdown(false)}>
            {dropdownContent}
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}
