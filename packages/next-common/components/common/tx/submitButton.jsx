import PrimaryButton from "next-common/lib/button/primary";
import WatchOnlyTooltip from "next-common/components/watchOnly/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";

// Primary button for tx submissions: disabled, with a hint tooltip, when the
// connected account is watch-only.
export default function SubmitButton({ disabled = false, children, ...props }) {
  const isWatchOnly = useIsWatchOnly();

  return (
    <WatchOnlyTooltip>
      <PrimaryButton {...props} disabled={disabled || isWatchOnly}>
        {children}
      </PrimaryButton>
    </WatchOnlyTooltip>
  );
}
