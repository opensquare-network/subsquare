import { cn } from "next-common/utils";
import { AddressUser } from "next-common/components/user";
import Tooltip from "next-common/components/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WalletWatchOnly } from "next-common/utils/consts/connect/walletIcons";

// Connected account shown in the header. A watch-only account gets an eye badge
// on its avatar: it is absolutely positioned, so the display size is unchanged.
export default function ConnectedAccountDisplay({ address, className }) {
  const isWatchOnly = useIsWatchOnly();
  const account = <AddressUser add={address} noEvent />;

  if (!isWatchOnly) {
    return account;
  }

  return (
    <Tooltip content="Watch-only account">
      <div className={cn("relative flex items-center", className)}>
        {account}
        <WalletWatchOnly className="absolute left-2 bottom-0 w-3 h-3" />
      </div>
    </Tooltip>
  );
}
