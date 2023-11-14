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
import {
  addressEllipsis,
  isKeyRegisteredUser,
  toPrecision,
} from "next-common/utils";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import useKintAccountInfo from "next-common/hooks/useKintAccountInfo";
import isEmpty from "lodash.isempty";
import ValueDisplay from "next-common/components/valueDisplay";
import Loading from "next-common/components/loading";
import Tooltip from "next-common/components/tooltip";
import useSubscribeAccount from "next-common/hooks/account/useSubAccount";
import AccountBalances from "next-common/components/overview/accountInfo/components/accountBalances";

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

function BalanceItem({ title, value }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <div className="flex flex-col grow">
      <span className="text-textTertiary text12Medium">{title}</span>
      <span className="text-textPrimary text16Bold [&_.value-display-symbol]:text-textTertiary">
        <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
      </span>
    </div>
  );
}

function EmptyBalanceItem({ title }) {
  return (
    <div className="flex flex-col grow">
      <span className="text-textTertiary text12Medium">{title}</span>
      <span className="text-textTertiary text16Bold">-</span>
    </div>
  );
}

function BalanceItems({ accountInfo }) {
  const showTransferrable = !isEmpty(accountInfo?.data?.transferrable);
  const showLocked = !isEmpty(accountInfo?.data?.lockedBalance);

  return (
    <div className="grid md:grid-flow-col max-md:grid-cols-2 grow gap-[16px]">
      <BalanceItem title="Total Balance" value={accountInfo?.data?.total} />
      {showTransferrable ? (
        <BalanceItem
          title="Transferable"
          value={accountInfo?.data?.transferrable}
        />
      ) : (
        <BalanceItem title="Free" value={accountInfo?.data?.free} />
      )}
      {showLocked ? (
        <BalanceItem title="Locked" value={accountInfo?.data?.lockedBalance} />
      ) : (
        <EmptyBalanceItem title="Locked" />
      )}
    </div>
  );
}

function Balances({ accountInfo }) {
  const router = useRouter();

  const goAccount = () => {
    router.push("/account/votes");
  };

  return (
    <div className="flex w-full max-md:flex-col">
      <BalanceItems accountInfo={accountInfo} />
      <div className="flex justify-end items-end md:w-1/4 max-md:mt-[16px]">
        <span
          className="cursor-pointer text14Medium text-theme500 mt-[8px]"
          onClick={goAccount}
        >
          Manage Account
        </span>
      </div>
    </div>
  );
}

function AssetInfoLoading() {
  return (
    <div className="flex justify-center w-full my-[12px]">
      <Loading size={20} />
    </div>
  );
}

function AssetInfo() {
  useSubscribeAccount();
  return <AccountBalances />;
}

function KintAssetInfo() {
  const user = useUser();
  const accountInfo = useKintAccountInfo(user?.address);

  if (!accountInfo) {
    return <AssetInfoLoading />;
  }

  return <Balances accountInfo={accountInfo} />;
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
