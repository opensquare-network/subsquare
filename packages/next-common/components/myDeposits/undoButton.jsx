import { cn } from "next-common/utils";
import SecondaryButton from "next-common/lib/button/secondary";
import { noop } from "lodash-es";
import { SystemClose } from "@osn/icons/subsquare";

export default function MyDepositUndoButton({
  disabled,
  className = "",
  onClick = noop,
  ...restProps
}) {
  return (
    <SecondaryButton
      disabled={disabled}
      className={cn(
        "group",
        "!p-1.5 !w-7 !h-7 !rounded !border-neutral400",
        "disabled:bg-neutral100",
        className,
      )}
      onClick={onClick}
      {...restProps}
    >
      <SystemClose
        className={cn(
          "w-4 h-4 [&_path]:stroke-textPrimary [&_path]:fill-textPrimary",
          "group-disabled:[&_path]:stroke-textDisabled group-disabled:[&_path]:fill-textDisabled",
        )}
      />
    </SecondaryButton>
  );
}
