import Avatar from "next-common/components/avatar";
import { Wrapper } from "./styled";
import Gravatar from "next-common/components/gravatar";
import { useUser } from "next-common/context/user";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import Copyable from "next-common/components/copyable";
import tw from "tailwind-styled-components";
import { SystemProfile, SystemSetting } from "@osn/icons/subsquare";
import { useRouter } from "next/router";
import { addressEllipsis, isKeyRegisteredUser } from "next-common/utils";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import Tooltip from "next-common/components/tooltip";
import useSubscribeAccount from "next-common/hooks/account/useSubAccount";
import AccountBalances from "next-common/components/overview/accountInfo/components/accountBalances";
import useSubKintsugiAccount from "next-common/hooks/account/useSubKintsugiAccount";

const DisplayUserAvatar = () => {
  const user = useUser();
  return user?.address ? (
    <Avatar address={user?.address} size={40} />
  ) : (
    <Gravatar emailMd5={user?.emailMd5} size={40} />
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

  return (
    <div className="flex gap-[12px]">
      <DisplayUserAvatar />
      <div className="flex flex-col">
        <DisplayUser />
        <Copyable className="max-md:hidden text-textTertiary text14Medium">
          {user?.address}
        </Copyable>
        <Copyable
          className="md:hidden text-textTertiary text14Medium"
          copyText={user?.address}
        >
          {addressEllipsis(user?.address)}
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

function AccountHead() {
  const router = useRouter();
  const user = useUser();
  const isKeyUser = isKeyRegisteredUser(user);

  const goProfile = () => {
    router.push(`/user/${user?.address}`);
  };

  const goSetting = () => {
    if (isKeyUser) {
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

function AssetInfo() {
  useSubscribeAccount();
  return <AccountBalances />;
}

function KintAssetInfo() {
  useSubKintsugiAccount();
  return <AccountBalances />;
}

const Divider = tw.div`
  w-full
  h-[1px]
  my-[16px]
  bg-neutral300
`;

export default function AccountInfoPanel() {
  const chain = useChain();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

  return (
    <Wrapper className="flex-col">
      <AccountHead />
      <Divider />
      {isKintsugi ? <KintAssetInfo /> : <AssetInfo />}
    </Wrapper>
  );
}
