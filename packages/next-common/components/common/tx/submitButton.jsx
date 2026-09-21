import PrimaryButton from "next-common/lib/button/primary";
import WatchOnlyTooltip from "next-common/components/watchOnly/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";

// Tx submit button. Watch-only accounts are handled here: the button is
// disabled and its tooltip becomes the watch-only hint.
export default function SubmitButton({
  tooltip,
  disabled = false,
  children,
  ...props
}) {
  const isWatchOnly = useIsWatchOnly();

  return (
    <WatchOnlyTooltip content={tooltip}>
      <PrimaryButton {...props} disabled={disabled || isWatchOnly}>
        {children}
      </PrimaryButton>
    </WatchOnlyTooltip>
  );
}
