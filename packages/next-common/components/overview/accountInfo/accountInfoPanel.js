import { useIsWeb3User, useUser } from "next-common/context/user";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import tw from "tailwind-styled-components";
import { SystemProfile, SystemSetting } from "@osn/icons/subsquare";
import { useRouter } from "next/router";
import { addressEllipsis } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import useSubscribeAccount from "next-common/hooks/account/useSubAccount";
import AccountBalances from "next-common/components/overview/accountInfo/components/accountBalances";
import Divider from "next-common/components/styled/layout/divider";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import ManageAccountButton from "./components/manageAccountButton";
import AccountPanelScrollPrompt from "./components/accountPanelScrollPrompt";
import ExtensionUpdatePrompt from "./components/extensionUpdatePrompt";
import AssetHubManagePrompt from "./components/assetHubManagePrompt";

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
        <Copyable className="max-md:hidden text-textTertiary text14Medium">
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

export function AccountHead() {
  const router = useRouter();
  const user = useUser();
  const isWeb3User = useIsWeb3User();

  const goProfile = () => {
    router.push(`/user/${user?.address}`);
  };

  const goSetting = () => {
    if (isWeb3User) {
      router.push("/settings/key-account");
    } else {
      router.push("/settings/account");
    }
  };

  return (
    <div className="flex justify-between items-center grow">
      <Account />
      <div className="flex gap-[16px]">
        <Tooltip content="Profile">
          <IconButton
            className="[&_svg_path]:fill-textSecondary"
            onClick={goProfile}
          >
            <SystemProfile width={20} height={20} />
          </IconButton>
        </Tooltip>
        <Tooltip content="Settings">
          <IconButton
            className="[&_svg_path]:stroke-textSecondary"
            onClick={goSetting}
          >
            <SystemSetting width={20} height={20} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export function CommonAccountInfoPanel({ hideManageAccountLink }) {
  return (
    <NeutralPanel className="p-6 space-y-4">
      <ProxyTip />
      <AccountHead />
      <Divider />
      <AccountBalances />
      {!hideManageAccountLink && <ManageAccountButton />}
      <ExtensionUpdatePrompt />
      <AssetHubManagePrompt />
      <AccountPanelScrollPrompt />
    </NeutralPanel>
  );
}

export default function AccountInfoPanel({ hideManageAccountLink }) {
  useSubscribeAccount();

  return (
    <CommonAccountInfoPanel hideManageAccountLink={hideManageAccountLink} />
  );
}
