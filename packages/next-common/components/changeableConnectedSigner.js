import React from "react";
import styled from "styled-components";
import Account from "./account";
import EmptyAccount from "./emptyAccount";
import { GreyPanel } from "./styled/containers/greyPanel";
import { useDisconnectAddress } from "next-common/context/connectedAddress";
import { useSignerAccount } from "./popupWithSigner/context";

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  justify-content: space-between;
`;

export default function ChangeableConnectedSigner() {
  const signerAccount = useSignerAccount();
  const disconnectAddress = useDisconnectAddress();

  return (
    <Wrapper>
      <div className="flex items-center gap-[16px]">
        {signerAccount ? <Account account={signerAccount} /> : <EmptyAccount />}
      </div>
      <button
        className="text14Medium text-theme500"
        onClick={disconnectAddress}
      >
        Change
      </button>
    </Wrapper>
  );
}
