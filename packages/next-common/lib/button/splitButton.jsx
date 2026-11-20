import { ArrowDown } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import { DropdownPanel, useSplitDropdown } from "./splitDropdown";

// Color variant of the split button: "primary" (filled, default) or
// "secondary" (outline). Both share the same structure, only the underlying
// button component differs.
//
// The right part is either a dropdown menu (`dropdownContent`, opened by the
// arrow) or a single icon action (`rightIcon` + `onRightClick`), e.g. a shortcut
// to a related page. The icon action can stay enabled while the main button is
// disabled. Without either, the main button is rendered on its own.
export default function SplitButton({
  loading,
  disabled,
  dropdownContent,
  rightIcon,
  rightLabel,
  rightDisabled = disabled,
  onRightClick,
  mainTooltip,
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
  const hasDropdown = !!dropdownContent;
  const hasRightAction = !hasDropdown && !!rightIcon;

  const plainButton = (
    <ButtonComponent
      loading={loading}
      disabled={disabled}
      {...props}
      onClick={onClick}
      className={cn(props?.className, fullWidth && "w-full")}
    >
      {children}
    </ButtonComponent>
  );

  if (!hasDropdown && !hasRightAction) {
    return plainButton;
  }

  // The split layout cannot show a loading spinner on the main part only, so
  // fall back to the plain button while the action is being resolved.
  if (loading) {
    return plainButton;
  }

  const mainButton = (
    <ButtonComponent
      disabled={disabled}
      {...props}
      onClick={mainClickOpensMenu ? toggleDropdown : onClick}
      className={cn(
        "rounded-tr-none rounded-br-none",
        fullWidth && (mainTooltip ? "w-full" : "flex-1"),
        // A disabled button swallows pointer events, which would hide the
        // tooltip explaining why it cannot be clicked
        mainTooltip && disabled && "pointer-events-none",
      )}
    >
      {children}
    </ButtonComponent>
  );

  const rightButton = (
    <ButtonComponent
      disabled={hasDropdown ? disabled : rightDisabled}
      {...props}
      onClick={hasDropdown ? toggleDropdown : onRightClick}
      aria-label={hasRightAction ? rightLabel : undefined}
      className="rounded-tl-none rounded-bl-none p-[8px]"
    >
      {hasRightAction ? rightIcon : <ArrowDown width={24} height={24} />}
    </ButtonComponent>
  );

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
      {mainTooltip ? (
        <Tooltip className={cn(fullWidth && "flex-1")} content={mainTooltip}>
          {mainButton}
        </Tooltip>
      ) : (
        mainButton
      )}
      <div
        ref={anchorRef}
        className={cn(
          "relative",
          isSecondary && "-ml-px",
          fullWidth && "shrink-0",
        )}
      >
        {hasRightAction && rightLabel ? (
          <Tooltip content={rightLabel}>{rightButton}</Tooltip>
        ) : (
          rightButton
        )}
        {hasDropdown && showDropdown && (
          <DropdownPanel onClick={closeDropdown}>
            {dropdownContent}
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}
