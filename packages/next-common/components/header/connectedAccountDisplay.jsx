import { cn } from "next-common/utils";
import { AddressUser } from "next-common/components/user";
import Tooltip from "next-common/components/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WalletWatchOnly } from "next-common/utils/consts/connect/walletIcons";

// Connected account shown in the header. A watch-only account hides the avatar
// and shows an eye icon in its place.
export default function ConnectedAccountDisplay({ address, className }) {
  const isWatchOnly = useIsWatchOnly();

  if (!isWatchOnly) {
    return <AddressUser add={address} noEvent />;
  }

  return (
    <Tooltip content="Watch-only account">
      <div className={cn("flex items-center", className)}>
        <WalletWatchOnly className="mr-2 w-4 h-4 shrink-0 text-textTertiary" />
        <AddressUser add={address} noEvent showAvatar={false} />
      </div>
    </Tooltip>
  );
}
