import { cn } from "next-common/utils";
import { memo } from "react";
import { IdentityDisplay } from "next-common/components/addressCombo";
import { useOriginAccount } from "next-common/components/signer";
import AddressAvatar from "next-common/components/user/addressAvatar";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { EvmWalletIcon, WalletIcon } from "next-common/components/account";
import StatusAndRank from "next-common/components/fellowship/salary/actions/payout/statusAndRank";
import EmptyAccount from "next-common/components/emptyAccount";

const NameWrapper = ({ children, className = "" }) => (
  <div
    className={cn(
      "flex-grow",
      "flex-1",
      "overflow-hidden",
      "text-textPrimary",
      className,
    )}
  >
    <div className="text14Medium">{children[0]}</div>
    <div className="text12Medium text-textTertiary">{children[1]}</div>
  </div>
);

const AvatarWrapper = ({ children }) => (
  <div className="flex items-center relative">{children}</div>
);

function AccountInfo({ account }) {
  if (!account) {
    return <EmptyAccount />;
  }

  const { address, name, type } = account ?? {};
  const wallet = account?.meta?.source;
  const connectorId = account?.meta?.connectorId;
  const isEthereum = type === ChainTypes.ETHEREUM;

  return (
    <>
      <AvatarWrapper>
        <AddressAvatar address={address} size={40} />
        {isEthereum ? (
          <EvmWalletIcon id={connectorId} wallet={wallet} />
        ) : (
          <WalletIcon wallet={wallet} />
        )}
      </AvatarWrapper>
      <NameWrapper className="ml-4">
        <IdentityDisplay address={address} name={name} />
        <span className="flex-1 w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
          {address}
        </span>
      </NameWrapper>
    </>
  );
}

function FellowshipOrigin({ className = "" }) {
  const account = useOriginAccount();

  return (
    <div className={cn(className)}>
      <p className="flex items-center pb-2 text-textPrimary text14Medium font-bold">
        origin
      </p>
      <div className="flex flex-1 p-3 rounded-[8px] bg-neutral200 items-center">
        <AccountInfo account={account} />
        <StatusAndRank address={account?.address} />
      </div>
    </div>
  );
}
export default memo(FellowshipOrigin);
