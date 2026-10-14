import { useState } from "react";
import { isNil } from "lodash-es";
import { SystemTransfer } from "@osn/icons/subsquare";
import { addressEllipsis, toPrecision } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { IconButton } from "next-common/components/styled/iconButton";
import Divider from "next-common/components/styled/layout/divider";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import Copyable from "next-common/components/copyable";
import Tooltip from "next-common/components/tooltip";
import AddressUser from "next-common/components/user/addressUser";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useUser } from "next-common/context/user";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDotUsdContext } from "./context";
import useDotUsdBalance from "./useDotUsdBalance";

const TransferPopup = dynamicPopup(() => import("./transferPopup"));

function AccountIdentity({ address }) {
  const user = useUser();

  return (
    <div className="flex gap-[12px] min-w-0">
      <AvatarDisplay
        address={address}
        // A custom avatar hangs off the user's own address, so it does not describe the
        // proxied account that the balance and the transfer are about.
        avatarCid={user?.proxyAddress ? undefined : user?.avatarCid}
        emailMd5={user?.emailMd5}
        size={40}
      />
      <div className="flex flex-col min-w-0">
        <AddressUser
          add={address}
          showAvatar={false}
          className="text14Medium text-textPrimary"
        />
        {/* The full address is only useful on a wide screen; on a phone it would wrap. */}
        <Copyable
          className="max-md:hidden text14Medium text-textTertiary"
          copyText={address}
        >
          {address}
        </Copyable>
        <Copyable
          className="md:hidden text14Medium text-textTertiary"
          copyText={address}
        >
          {addressEllipsis(address)}
        </Copyable>
      </div>
    </div>
  );
}

function TransferButton({ assetId, symbol, decimals }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Transfer">
        <IconButton
          className="text-theme500 bg-theme100"
          // Without an asset id there is nothing to build a transfer from.
          disabled={isNil(assetId)}
          onClick={() => setShowPopup(true)}
        >
          <SystemTransfer className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {showPopup && (
        <TransferPopup
          assetId={assetId}
          symbol={symbol}
          decimals={decimals}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

// Mirrors the balance row of the overview account panel (AccountBalanceItem): the label and
// the amount are both 14px, the label in the tertiary colour and the amount in the primary
// one, with the two ends of the row aligned.
function Balance({ value, symbol, decimals, isLoading }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text14Medium text-textTertiary">Balance</span>
      <span className="text14Medium text-textPrimary min-w-0 break-all text-right">
        <LoadableContent size={16} isLoading={isLoading}>
          {isNil(value) ? (
            <span className="text-textTertiary">—</span>
          ) : (
            <ValueDisplay
              value={toPrecision(value, decimals)}
              symbol={symbol}
            />
          )}
        </LoadableContent>
      </span>
    </div>
  );
}

function ConnectedAccount({ asset, isLoading: isAssetLoading }) {
  const address = useRealAddress();
  const { index: assetId, symbol, decimals } = asset ?? {};
  const { balance, isLoading: isBalanceLoading } = useDotUsdBalance({
    address,
    assetId,
  });

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <AccountIdentity address={address} />
        <TransferButton assetId={assetId} symbol={symbol} decimals={decimals} />
      </div>

      <Divider />

      <Balance
        value={balance}
        symbol={symbol}
        decimals={decimals}
        // The asset itself is read from the PSM storage, so the balance cannot be asked
        // for before that read lands.
        isLoading={isAssetLoading || isBalanceLoading}
      />
    </>
  );
}

function ConnectPrompt() {
  const { openLoginPopup } = useLoginPopup();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <span className="text14Medium text-textTertiary">
        Connect your wallet to see your dotUSD balance and transfer it.
      </span>
      <PrimaryButton onClick={openLoginPopup}>Connect Wallet</PrimaryButton>
    </div>
  );
}

export default function DotUsdAccount() {
  const { data, isLoading } = useDotUsdContext();
  const address = useRealAddress();

  return (
    <SecondaryCard className="space-y-4">
      {/* The connected account is the user's, not the chain's: whether there is a wallet to
          show must not wait on the PSM read. */}
      {address ? (
        <ConnectedAccount asset={data?.internalAsset} isLoading={isLoading} />
      ) : (
        <ConnectPrompt />
      )}
    </SecondaryCard>
  );
}
