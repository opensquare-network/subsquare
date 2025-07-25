import React, { useMemo } from "react";
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
import useOnChainProxyInfo from "next-common/hooks/useOnChainProxy";
import Tooltip from "./tooltip";
import { MultisigAccount } from "./multisigs/styled";
import SwitchButtonWrapper from "./switchAccountButton";

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  gap: 16px;
`;

export function useOriginAccount() {
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

function MultisigHint({ multisig }) {
  if (!multisig) {
    return null;
  }
  return (
    <div className="flex items-center gap-[8px] mt-[12px] pt-[12px] pl-[52px] border-neutral300 border-t text12Medium text-textSecondary">
      <>
        <div className="bg-theme500 rounded-[10px] py-[2px] px-[8px] text-textPrimaryContrast">
          Multisig
        </div>
        <span>{" · "}</span>
      </>
      <Tooltip
        className="truncate"
        content="Your transaction will be submitted as a multisig transaction"
      >
        <div className="truncate">
          Your transaction will be submitted as a multisig transaction
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

function MaybeMultisigAccount({ signerAccount }) {
  const originAccount = useOriginAccount();

  if (!signerAccount) {
    return null;
  }

  if (signerAccount.multisig) {
    return (
      <MultisigAccount
        multisig={signerAccount.multisig}
        className="text14Medium [&_span]:text12Medium"
        showCopyableAddress={false}
      />
    );
  }

  return <Account account={originAccount} />;
}

export default function MaybeProxySigner({
  noSwitch,
  supportedMultisig = true,
}) {
  const signerAccount = useSignerAccount();

  return (
    <Wrapper>
      <div className="w-full">
        <div className="flex justify-between items-center gap-[12px] w-full relative">
          {signerAccount ? (
            <MaybeMultisigAccount signerAccount={signerAccount} />
          ) : (
            <EmptyAccount />
          )}
          {!noSwitch && (
            <SwitchButtonWrapper supportedMultisig={supportedMultisig} />
          )}
        </div>
        {signerAccount?.proxyAddress && (
          <ProxyHintForAddress address={signerAccount?.proxyAddress} />
        )}
        {signerAccount?.multisig && supportedMultisig && (
          <MultisigHint multisig={signerAccount?.multisig} />
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
