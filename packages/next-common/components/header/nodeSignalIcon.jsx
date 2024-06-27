import {
  SignalDefault,
  SignalDefaultDark,
  SignalFast,
  SignalMedium,
  SignalSlow,
} from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function NodeSignalIcon({ delay, className = "" }) {
  if (!delay || isNaN(delay)) {
    return (
      <>
        <SignalDefault className={cn("w-6 h-6 dark:hidden", className)} />
        <SignalDefaultDark
          className={cn("w-6 h-6 hidden dark:block", className)}
        />
      </>
    );
  }

  let Icon;

  if (delay >= 300) {
    Icon = SignalSlow;
  } else if (delay >= 100) {
    Icon = SignalMedium;
  } else {
    Icon = SignalFast;
  }

  return <Icon className={cn("w-6 h-6", className)} />;
}
