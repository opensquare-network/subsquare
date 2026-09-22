import { SystemClose } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
import { cn } from "next-common/utils";
import SubmitButton from "next-common/components/common/tx/submitButton";

// ✕ variant of SubmitButton, for buttons that submit a tx.
export default function SubmitRemoveButton({
  tooltip,
  disabled = false,
  onClick = noop,
  className,
}) {
  return (
    <SubmitButton
      tooltip={tooltip}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-auto! p-1.5! rounded!",
        "bg-transparent! border-neutral400!",
        "text-textPrimary! disabled:text-textDisabled!",
        "cursor-pointer disabled:cursor-not-allowed!",
        className,
      )}
    >
      <SystemClose width={16} height={16} />
    </SubmitButton>
  );
}
