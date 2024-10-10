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
import { addressEllipsis } from "next-common/utils";
import SwitchSignerPopup from "./switchSignerPopup";
import useOnChainProxyInfo from "next-common/hooks/useOnChainProxy";

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

  const originAccountFromExtension = extensionAccounts.find(
    (account) => account.address === originAccount.address,
  );

  if (originAccountFromExtension) {
    return originAccountFromExtension;
  }

  return originAccount;
}

function SwitchButton() {
  const [showPopup, setShowPopup] = useState(false);
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

function ProxyHint({ address }) {
  const proxyInfo = useOnChainProxyInfo(address);
  const proxyType = proxyInfo?.proxyType?.toString();
  return (
    <div className="mt-[12px] pt-[12px] pl-[52px] border-neutral300 border-t text14Medium text-textSecondary">
      {proxyType && (
        <>
          <div className="inline-flex rounded-[10px] py-[2px] px-[8px] border border-neutral400 text12Medium">
            {proxyType}
          </div>
          {" · "}
        </>
      )}
      Your transactions will be submitted on behalf of this proxy address.
    </div>
  );
}

export default function ConnectedSigner() {
  const user = useUser();
  const signerAccount = useSignerAccount();
  const originAccount = useOriginAccount();

  return (
    <Wrapper>
      <div className="w-full">
        <div className="flex justify-between items-center gap-[12px] w-full">
          {originAccount ? (
            <Account account={originAccount} />
          ) : (
            <EmptyAccount />
          )}
          {user?.proxyAddress && <SwitchButton />}
        </div>
        {signerAccount?.proxyAddress && (
          <ProxyHint address={signerAccount?.proxyAddress} />
        )}
      </div>
    </Wrapper>
  );
}
