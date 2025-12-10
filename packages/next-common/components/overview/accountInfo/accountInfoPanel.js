import { useIsWeb3User, useUser } from "next-common/context/user";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { addressEllipsis, cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import AccountBalances from "next-common/components/overview/accountInfo/components/accountBalances";
import Divider from "next-common/components/styled/layout/divider";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import AccountPanelScrollPrompt from "./components/accountPanelScrollPrompt";
import ExtensionUpdatePrompt from "./components/extensionUpdatePrompt";
import { useAccountTransferPopup } from "./hook/useAccountTransferPopup";
import dynamic from "next/dynamic";
import { useState } from "react";
import { OnlyChains } from "next-common/components/common/onlyChain";
import Chains from "next-common/utils/consts/chains";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import useAccountUrl from "next-common/hooks/account/useAccountUrl";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { isNil } from "lodash-es";
import Link from "next-common/components/link";
import Button from "next-common/lib/button";
import AccountPanelQuickAccess from "./components/accountPanelQuickAccess";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Avatar from "next-common/components/avatar";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { AvatarImg } from "next-common/components/user/styled";
import Gravatar from "next-common/components/gravatar";

const ParaChainTeleportPopup = dynamic(() =>
  import("next-common/components/paraChainTeleportPopup").then(
    (mod) => mod.default,
  ),
);

const ParaChainTeleportOnRelayChainPopup = dynamic(() =>
  import("next-common/components/paraChainTeleportPopup/teleport").then(
    (mod) => mod.default,
  ),
);

const SystemCrosschain = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemCrosschain),
);
const MenuAccount = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.MenuAccount),
);
const SystemSetting = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemSetting),
);
const SystemTransfer = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemTransfer),
);

const DisplayUserAvatar = () => {
  const user = useUser();
  if (user?.proxyAddress) {
    return <Avatar address={user?.proxyAddress} size={40} />;
  }
  if (user?.avatarCid) {
    return <AvatarImg src={getIpfsLink(user?.avatarCid)} size={40} />;
  }
  if (user?.address) {
    return <Avatar address={user?.address} size={40} />;
  }
  return <Gravatar emailMd5={user?.emailMd5} size={40} />;
};

const DisplayUser = () => {
  const user = useUser();
  const address = useRealAddress();
  if (isPolkadotAddress(address) || isEthereumAddress(address)) {
    return (
      <AddressUser
        add={address}
        showAvatar={false}
        className="text14Medium text-textPrimary"
      />
    );
  }

  return <div className="text-textPrimary text14Bold">{user?.username}</div>;
};

export function Account() {
  const realAddress = useRealAddress();
  const maybeEvmAddress = tryConvertToEvmAddress(realAddress);

  return (
    <div className="flex gap-[12px]">
      <DisplayUserAvatar />
      <div className="flex flex-col">
        <DisplayUser />
        <Copyable className="max-md:hidden text-textTertiary text14Medium inline-flex items-center">
          {maybeEvmAddress}
        </Copyable>
        <Copyable
          className="md:hidden text-textTertiary text14Medium"
          copyText={maybeEvmAddress}
        >
          {addressEllipsis(maybeEvmAddress)}
        </Copyable>
      </div>
    </div>
  );
}

const IconButton = tw(Button)`
  flex
  justify-center
  items-center
  p-0
  w-[32px]
  h-[32px]
  rounded-[8px]
  bg-neutral200
`;

export function ProxyTip() {
  const user = useUser();
  const proxyAddress = user?.proxyAddress;
  if (!proxyAddress) {
    return null;
  }

  return (
    <div className="flex max-md:flex-col md:flex-row rounded-[8px] bg-neutral200 py-[10px] px-[16px] grow text-textPrimary md:gap-1">
      <div className="flex gap-1">
        <span className="text14Medium text-textSecondary">
          Set as a proxy to
        </span>
        <AddressUser
          add={proxyAddress}
          className="text14Medium text-textPrimary"
        />
      </div>
      <span className="text14Medium text-textSecondary">
        , all your transactions will be submitted on behalf of this proxied
        address.
      </span>
    </div>
  );
}

function TransferButton() {
  const { showPopup, component: transferPopup } = useAccountTransferPopup();
  return (
    <>
      <Tooltip content="Transfer">
        <IconButton
          className="text-theme500 bg-theme100"
          onClick={() => {
            showPopup();
          }}
        >
          <SystemTransfer className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      {transferPopup}
    </>
  );
}

function AccountButton() {
  const router = useRouter();
  const url = useAccountUrl();

  if (router.pathname.startsWith("/account")) {
    return null;
  }

  return (
    <Tooltip content="Account">
      <Link href={url}>
        <IconButton className="text-textSecondary">
          <MenuAccount width={20} height={20} />
        </IconButton>
      </Link>
    </Tooltip>
  );
}

function SettingsButton() {
  const isWeb3User = useIsWeb3User();

  let url;
  if (isWeb3User) {
    url = "/settings/key-account";
  } else {
    url = "/settings/account";
  }

  return (
    <Tooltip content="Settings">
      <Link href={url}>
        <IconButton className="text-textSecondary">
          <SystemSetting width={20} height={20} />
        </IconButton>
      </Link>
    </Tooltip>
  );
}

function CrosschainButton({ onClick }) {
  return (
    <Tooltip content="Cross-chain">
      <IconButton className="bg-theme100 text-theme500" onClick={onClick}>
        <SystemCrosschain width={20} height={20} />
      </IconButton>
    </Tooltip>
  );
}

function ParaChainTeleportButton() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <CrosschainButton onClick={() => setShowPopup(true)} />
      {showPopup && (
        <ParaChainTeleportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}

function ParaChainTeleportOnRelayChainButton() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <CrosschainButton onClick={() => setShowPopup(true)} />
      {showPopup && (
        <ParaChainTeleportOnRelayChainPopup
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

const transferEnabledChains = [
  Chains.polkadot,
  Chains.kusama,
  Chains.westend,
  Chains.rococo,
  Chains.paseo,
  Chains.hyperBridge,
];

const paraChainTeleportEnabledChains = [Chains.collectives];

const paraChainTeleportOnRelayChainEnabledChains = [
  Chains.polkadot,
  Chains.kusama,
  Chains.paseo,
  Chains.westend,
  Chains.polkadotPeople,
  Chains.kusamaPeople,
  Chains.paseoPeople,
  Chains.westendPeople,
];

export function AccountHead({ width }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex justify-between items-start grow gap-4",
          width > 768 ? "flex-row" : "flex-col",
        )}
      >
        <div className="flex flex-col gap-2">
          <Account />
          <AccountPanelQuickAccess />
        </div>
        <div className="flex gap-[16px] items-center">
          <OnlyChains chains={transferEnabledChains}>
            <TransferButton />
          </OnlyChains>
          <OnlyChains chains={paraChainTeleportOnRelayChainEnabledChains}>
            <RelayChainApiProvider>
              <ParaChainTeleportOnRelayChainButton />
            </RelayChainApiProvider>
          </OnlyChains>
          <OnlyChains chains={paraChainTeleportEnabledChains}>
            <RelayChainApiProvider>
              <ParaChainTeleportButton />
            </RelayChainApiProvider>
          </OnlyChains>
          <OnlyChains
            chains={[
              ...transferEnabledChains,
              ...paraChainTeleportEnabledChains,
              ...paraChainTeleportOnRelayChainEnabledChains,
            ]}
          >
            <div className="w-[1px] h-[16px] bg-neutral300"></div>
          </OnlyChains>
          <AccountButton />
          <SettingsButton />
        </div>
      </div>
    </div>
  );
}

export default function AccountInfoPanel() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return (
    <NeutralPanel className="p-6 space-y-4">
      <ProxyTip />
      <AccountHead width={width} />
      <Divider />
      <AccountBalances />
      <ExtensionUpdatePrompt />
      <AccountPanelScrollPrompt />
    </NeutralPanel>
  );
}
