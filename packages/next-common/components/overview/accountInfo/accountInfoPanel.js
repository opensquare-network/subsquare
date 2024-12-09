import { useIsWeb3User, useUser } from "next-common/context/user";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { addressEllipsis, cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import useSubscribeAccount from "next-common/hooks/account/useSubAccount";
import AccountBalances from "next-common/components/overview/accountInfo/components/accountBalances";
import Divider from "next-common/components/styled/layout/divider";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import AccountPanelScrollPrompt from "./components/accountPanelScrollPrompt";
import ExtensionUpdatePrompt from "./components/extensionUpdatePrompt";
import AssetHubManagePrompt from "./components/assetHubManagePrompt";
import MultisigManagePrompt from "./components/multisigManagePrompt";
import { useAccountTransferPopup } from "./hook/useAccountTransferPopup";
import dynamic from "next/dynamic";
import { useState } from "react";
import { OnlyChains } from "next-common/components/common/onlyChain";
import Chains from "next-common/utils/consts/chains";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import { CollectivesApiProvider } from "next-common/context/collectives/api";
import useAccountUrl from "next-common/hooks/account/useAccountUrl";

const RelayChainTeleportPopup = dynamic(
  import("./relayChainTeleportPopup").then((mod) => mod.default),
);
const ParaChainTeleportPopup = dynamic(() =>
  import("next-common/components/assets/paraChainTeleportPopup").then(
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
  return (
    <AvatarDisplay
      avatarCid={user?.avatarCid}
      address={user?.address}
      emailMd5={user?.emailMd5}
      size={40}
    />
  );
};

const DisplayUser = () => {
  const user = useUser();
  const address = user?.address;
  if (isPolkadotAddress(address) || isEthereumAddress(address)) {
    return <AddressUser add={address} showAvatar={false} fontSize={14} />;
  }

  return <div className="text-textPrimary text14Bold">{user?.username}</div>;
};

function Account() {
  const user = useUser();
  const maybeEvmAddress = tryConvertToEvmAddress(user?.address);

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

const IconButton = tw.div`
  cursor-pointer
  flex
  justify-center
  items-center
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
        <AddressUser add={proxyAddress} fontSize={14} />
      </div>
      <span className="text14Medium text-textSecondary">
        , all your transactions will be submitted on behalf of this proxy
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

  const goAccount = () => {
    router.push(url);
  };

  return (
    <Tooltip content="Account">
      <IconButton
        className="[&_svg_path]:fill-textSecondary"
        onClick={goAccount}
      >
        <MenuAccount width={20} height={20} />
      </IconButton>
    </Tooltip>
  );
}

function SettingsButton() {
  const router = useRouter();
  const isWeb3User = useIsWeb3User();

  const goSetting = () => {
    if (isWeb3User) {
      router.push("/settings/key-account");
    } else {
      router.push("/settings/account");
    }
  };

  return (
    <Tooltip content="Settings">
      <IconButton
        className="[&_svg_path]:stroke-textSecondary"
        onClick={goSetting}
      >
        <SystemSetting width={20} height={20} />
      </IconButton>
    </Tooltip>
  );
}

function CrosschainButton({ onClick }) {
  return (
    <Tooltip content="Cross-chain">
      <IconButton
        className={cn("bg-theme100 [&_svg_path]:fill-theme500")}
        onClick={onClick}
      >
        <SystemCrosschain width={20} height={20} />
      </IconButton>
    </Tooltip>
  );
}

function TeleportButton() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <CrosschainButton onClick={() => setShowPopup(true)} />
      {showPopup && (
        <RelayChainTeleportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
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

const transferEnabledChains = [
  Chains.polkadot,
  Chains.kusama,
  Chains.westend,
  Chains.rococo,
];

const relayChainTeleportEnabledChains = [Chains.polkadot, Chains.kusama];

const paraChainTeleportEnabledChains = [Chains.collectives];

export function AccountHead() {
  return (
    <div className="flex justify-between items-center grow">
      <Account />
      <div className="flex gap-[16px] items-center">
        <OnlyChains chains={transferEnabledChains}>
          <TransferButton />
        </OnlyChains>
        <OnlyChains chains={relayChainTeleportEnabledChains}>
          <AssetHubApiProvider>
            <CollectivesApiProvider>
              <TeleportButton />
            </CollectivesApiProvider>
          </AssetHubApiProvider>
        </OnlyChains>
        <OnlyChains chains={paraChainTeleportEnabledChains}>
          <RelayChainApiProvider>
            <ParaChainTeleportButton />
          </RelayChainApiProvider>
        </OnlyChains>
        <OnlyChains
          chains={[
            ...transferEnabledChains,
            ...relayChainTeleportEnabledChains,
            ...paraChainTeleportEnabledChains,
          ]}
        >
          <div className="w-[1px] h-[16px] bg-neutral300"></div>
        </OnlyChains>
        <AccountButton />
        <SettingsButton />
      </div>
    </div>
  );
}

export function CommonAccountInfoPanel() {
  return (
    <NeutralPanel className="p-6 space-y-4">
      <ProxyTip />
      <AccountHead />
      <Divider />
      <AccountBalances />
      <ExtensionUpdatePrompt />
      <AssetHubManagePrompt />
      <MultisigManagePrompt />
      <AccountPanelScrollPrompt />
    </NeutralPanel>
  );
}

export default function AccountInfoPanel() {
  useSubscribeAccount();

  return <CommonAccountInfoPanel />;
}
