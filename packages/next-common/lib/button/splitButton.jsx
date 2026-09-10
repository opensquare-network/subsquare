import { ArrowDown } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";
import { DropdownPanel, useSplitDropdown } from "./splitDropdown";

// Color variant of the split button: "primary" (filled, default) or
// "secondary" (outline). Both share the same structure, only the underlying
// button component differs.
export default function SplitButton({
  loading,
  disabled,
  dropdownContent,
  mainClickOpensMenu = false,
  fullWidth = false,
  variant = "primary",
  children,
  onClick,
  ...props
}) {
  const { showDropdown, anchorRef, closeDropdown, toggleDropdown } =
    useSplitDropdown();

  const isSecondary = variant === "secondary";
  const ButtonComponent = isSecondary ? SecondaryButton : PrimaryButton;

  if (loading) {
    return (
      <ButtonComponent
        loading={loading}
        {...props}
        onClick={onClick}
        className={cn(props?.className, fullWidth && "w-full")}
      >
        {children}
      </ButtonComponent>
    );
  }

  return (
    <div
      className={cn(
        "flex",
        // Secondary parts carry a 1px border each: overlapping them instead
        // of leaving a gap keeps the middle divider a single line.
        isSecondary ? "gap-0" : "gap-[1px]",
        fullWidth && "w-full",
      )}
    >
      <ButtonComponent
        disabled={disabled}
        {...props}
        onClick={mainClickOpensMenu ? toggleDropdown : onClick}
        className={cn("rounded-tr-none rounded-br-none", fullWidth && "flex-1")}
      >
        {children}
      </ButtonComponent>
      <div
        ref={anchorRef}
        className={cn(
          "relative",
          isSecondary && "-ml-px",
          fullWidth && "shrink-0",
        )}
      >
        <ButtonComponent
          disabled={disabled}
          {...props}
          onClick={toggleDropdown}
          className="rounded-tl-none rounded-bl-none p-[8px]"
        >
          <ArrowDown width={24} height={24} />
        </ButtonComponent>
        {showDropdown && (
          <DropdownPanel onClick={closeDropdown}>
            {dropdownContent}
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}
