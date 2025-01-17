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
import { addressEllipsis, cn, isSameAddress } from "next-common/utils";
import { useMemo } from "react";
import { noop } from "lodash-es";

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
      <ArrowRight
        className={cn(
          "w-[20px] h-[20px]",
          "[&_path]:stroke-textTertiary group-hover:[&_path]:stroke-textSecondary",
        )}
      />
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
    <div
      className={cn(
        "mt-[12px] pt-[12px] pl-[52px]",
        "border-neutral300 border-t",
        "text12Medium text-textSecondary",
      )}
    >
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

export function OriginAddress({ selected, onSelect = noop }) {
  const onClose = usePopupOnClose();
  const user = useUser();
  const extensionAccounts = useExtensionAccounts();
  const account = useMemo(
    () =>
      extensionAccounts.find((item) =>
        isSameAddress(item.address, user.address),
      ),
    [extensionAccounts, user.address],
  );

  const disabled = isSameAddress(selected, user.address);

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text14Bold text-textPrimary">Connected</div>
      <AccountItem
        disabled={disabled}
        account={account}
        onClick={() => {
          onSelect();
          onClose();
        }}
      />
    </div>
  );
}

function ProxyAddress({ disabled, proxyInfo, onClick = noop }) {
  const { signerAccount } = useSignerContext();
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

  return (
    <ProxyAccountItem
      disabled={disabled}
      account={account}
      proxyType={proxyInfo.proxyType}
      onClick={onClick}
    />
  );
}

export function ProxiedAccounts({ selected, onSelect = noop }) {
  const onClose = usePopupOnClose();
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
          <ProxyAddress
            key={index}
            proxyInfo={proxy}
            disabled={isSameAddress(selected, proxy.delegator)}
            onClick={() => {
              onSelect(proxy.delegator);
              onClose();
            }}
          />
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
  const { signerAccount, setProxyAddress } = useSignerContext();

  return (
    <Popup title="Select Address" onClose={onClose}>
      <div className="flex flex-col gap-[24px]">
        <OriginAddress
          selected={signerAccount.proxyAddress}
          onSelect={() => setProxyAddress()}
        />
        <ProxiedAccounts
          selected={signerAccount.proxyAddress}
          onSelect={(proxyAddress) => setProxyAddress(proxyAddress)}
        />
      </div>
    </Popup>
  );
}
