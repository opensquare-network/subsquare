import { SystemEye } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export function WalletWatchOnly({ className, ...props }) {
  return (
    <SystemEye {...props} className={cn("text-textSecondary", className)} />
  );
}
