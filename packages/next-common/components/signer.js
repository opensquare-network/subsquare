import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Account from "./account";
import EmptyAccount from "./emptyAccount";
import { GreyPanel } from "./styled/containers/greyPanel";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "./popupWithSigner/context";
import { useUser } from "next-common/context/user";
import { addressEllipsis, isSameAddress } from "next-common/utils";
import SwitchSignerPopup from "./switchSignerPopup";
import useOnChainProxyInfo from "next-common/hooks/useOnChainProxy";
import { useMyProxied } from "next-common/context/proxy";
import Tooltip from "./tooltip";

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  gap: 16px;
`;

function useOriginAccount() {
  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();

  const originAccount = useMemo(() => {
    if (!signerAccount) {
      return null;
    }
    if (!signerAccount.proxyAddress) {
      return signerAccount;
    }
    return {
      address: signerAccount.proxyAddress,
      name: addressEllipsis(signerAccount.proxyAddress),
      meta: signerAccount.meta,
    };
  }, [signerAccount]);

  if (!originAccount) {
    return null;
  }

  const originAccountFromExtension = extensionAccounts.find((account) =>
    isSameAddress(account.address, originAccount.address),
  );

  if (originAccountFromExtension) {
    return originAccountFromExtension;
  }

  return originAccount;
}

function SwitchButton() {
  const user = useUser();

  const { proxies } = useMyProxied();
  const [showPopup, setShowPopup] = useState(false);

  if (!proxies.length && !user?.proxyAddress) {
    return null;
  }

  return (
    <>
      <span
        className="cursor-pointer text-theme500 text14Medium"
        onClick={() => setShowPopup(true)}
      >
        Switch
      </span>
      {showPopup && <SwitchSignerPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}

function ProxyHint({ proxyType }) {
  return (
    <div className="flex items-center gap-[8px] mt-[12px] pt-[12px] pl-[52px] border-neutral300 border-t text12Medium text-textSecondary">
      {proxyType && (
        <>
          <div className="bg-theme500 rounded-[10px] py-[2px] px-[8px] text-textPrimaryContrast">
            Proxy
          </div>
          <span>{" · "}</span>
          {proxyType}
          <span>{" · "}</span>
        </>
      )}
      <Tooltip
        className="truncate"
        content="Your transaction will be submitted on behalf of this address."
      >
        <div className="truncate">
          Your transaction will be submitted on behalf of this address.
        </div>
      </Tooltip>
    </div>
  );
}

function ProxyHintForAddress({ address }) {
  const proxyInfo = useOnChainProxyInfo(address);
  const proxyType = proxyInfo?.proxyType?.toString();
  return <ProxyHint proxyType={proxyType} />;
}

export default function MaybeProxySigner({ noSwitch, showCollectiveStatus }) {
  const signerAccount = useSignerAccount();
  const originAccount = useOriginAccount();

  return (
    <Wrapper>
      <div className="w-full">
        <div className="flex justify-between items-center gap-[12px] w-full">
          {originAccount ? (
            <Account
              showCollectiveStatus={showCollectiveStatus}
              account={originAccount}
            />
          ) : (
            <EmptyAccount />
          )}
          {!noSwitch && <SwitchButton />}
        </div>
        {signerAccount?.proxyAddress && (
          <ProxyHintForAddress address={signerAccount?.proxyAddress} />
        )}
      </div>
    </Wrapper>
  );
}

export function ConnectedAccountSigner({ extra = null }) {
  const user = useUser();
  const extensionAccounts = useExtensionAccounts();
  const originAccount = extensionAccounts.find((item) =>
    isSameAddress(item.address, user?.address),
  );

  return (
    <Wrapper>
      <div className="w-full">
        <div className="flex justify-between items-center gap-[12px] w-full">
          {originAccount ? (
            <Account account={originAccount} />
          ) : (
            <EmptyAccount />
          )}
          {extra}
        </div>
      </div>
    </Wrapper>
  );
}
