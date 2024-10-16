import { useUser } from "next-common/context/user";
import Popup from "../popup/wrapper/Popup";
import {
  useExtensionAccounts,
  useSignerContext,
} from "../popupWithSigner/context";
import Account from "../account";
import { ArrowRight } from "@osn/icons/subsquare";
import { usePopupOnClose } from "next-common/context/popup";
import { useMyProxied } from "next-common/context/proxy";
import Tooltip from "../tooltip";
import tw from "tailwind-styled-components";
import Loading from "../loading";
import { addressEllipsis, isSameAddress } from "next-common/utils";
import { useMemo } from "react";

const DisabledAccountItemWrapper = tw.div`
  flex flex-col gap-[12px] p-[12px] pr-[16px]
  bg-neutral200 rounded-[8px]
`;

const AccountItemWrapper = tw.div`
  cursor-pointer
  flex flex-col p-[12px] pr-[16px]
  bg-neutral100 border border-neutral400 hover:border-neutral500 rounded-[8px] group
`;

function AccountDisplayWithArrow({ account }) {
  return (
    <div className="flex gap-[12px] items-center">
      <Account account={account} showFullAddress />
      <ArrowRight className="w-[20px] h-[20px] [&_path]:stroke-textTertiary group-hover:[&_path]:stroke-textSecondary" />
    </div>
  );
}

function AccountDisplay({ account }) {
  return (
    <div className="flex gap-[12px] items-center">
      <Account account={account} showFullAddress />
    </div>
  );
}

function ProxyHint({ proxyType }) {
  return (
    <div className="mt-[12px] pt-[12px] pl-[52px] border-neutral300 border-t text12Medium text-textSecondary">
      Proxy type: {proxyType}
    </div>
  );
}

function ProxyAccountItem({ disabled, account, proxyType, onClick }) {
  if (disabled) {
    return (
      <DisabledAccountItemWrapper>
        <AccountDisplay account={account} />
        <ProxyHint proxyType={proxyType} />
      </DisabledAccountItemWrapper>
    );
  }

  return (
    <AccountItemWrapper onClick={onClick}>
      <AccountDisplayWithArrow account={account} />
      <ProxyHint proxyType={proxyType} />
    </AccountItemWrapper>
  );
}

function AccountItem({ disabled, account, onClick }) {
  if (disabled) {
    return (
      <DisabledAccountItemWrapper>
        <AccountDisplay account={account} />
      </DisabledAccountItemWrapper>
    );
  }

  return (
    <AccountItemWrapper onClick={onClick}>
      <AccountDisplayWithArrow account={account} />
    </AccountItemWrapper>
  );
}

function OriginAddress() {
  const onClose = usePopupOnClose();
  const { signerAccount, setProxyAddress } = useSignerContext();
  const user = useUser();
  const extensionAccounts = useExtensionAccounts();
  const account = extensionAccounts.find((item) =>
    isSameAddress(item.address, user.address),
  );

  const disabled = !signerAccount.proxyAddress;

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text14Bold text-textPrimary">Connected</div>
      <AccountItem
        disabled={disabled}
        account={account}
        onClick={() => {
          setProxyAddress();
          onClose();
        }}
      />
    </div>
  );
}

function ProxyAddress({ proxyInfo }) {
  const onClose = usePopupOnClose();
  const { signerAccount, setProxyAddress } = useSignerContext();
  const extensionAccounts = useExtensionAccounts();

  const account = useMemo(() => {
    const extensionAccount = extensionAccounts.find((item) =>
      isSameAddress(item.address, proxyInfo.delegator),
    );
    if (extensionAccount) {
      return extensionAccount;
    }
    return {
      address: proxyInfo.delegator,
      name: addressEllipsis(proxyInfo.delegator),
      meta: signerAccount.meta,
    };
  }, [proxyInfo, extensionAccounts, signerAccount]);

  const disabled = signerAccount.proxyAddress === proxyInfo.delegator;

  return (
    <ProxyAccountItem
      disabled={disabled}
      account={account}
      proxyType={proxyInfo.proxyType}
      onClick={() => {
        setProxyAddress(proxyInfo.delegator);
        onClose();
      }}
    />
  );
}

function ProxiedAccounts() {
  const { proxies, isLoading } = useMyProxied();

  let proxyList = null;

  if (isLoading) {
    proxyList = (
      <div className="flex justify-center">
        <Loading size={20} />
      </div>
    );
  } else if (!proxies.length) {
    proxyList = (
      <div className="flex justify-center text14Medium text-textTertiary">
        No proxied accounts
      </div>
    );
  } else {
    proxyList = (
      <div className="flex flex-col gap-[12px]">
        {proxies.map((proxy, index) => (
          <ProxyAddress key={index} proxyInfo={proxy} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text14Bold text-textPrimary">
        Proxied Accounts{" "}
        <Tooltip content="Delegators who set proxies to the connected account"></Tooltip>
      </div>
      {proxyList}
    </div>
  );
}

export default function SwitchSignerPopup({ onClose }) {
  return (
    <Popup title="Select Address" className="w-[640px]" onClose={onClose}>
      <div className="flex flex-col gap-[24px]">
        <OriginAddress />
        <ProxiedAccounts />
      </div>
    </Popup>
  );
}
