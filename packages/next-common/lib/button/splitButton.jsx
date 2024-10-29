import { ArrowDown } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { cn } from "next-common/utils";

function DropdownPanel({ onClick, children }) {
  return (
    <div
      className={cn(
        "z-[999999] absolute top-[calc(100%+4px)] right-0",
        "min-w-[calc(100%+2px)] py-2 px-0",
        "shadow-200 rounded dark:border dark:border-neutral300",
        "whitespace-nowrap bg-neutral100 text-textPrimary",
      )}
      onClick={onClick}
    >
      {children}
    </div>
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
