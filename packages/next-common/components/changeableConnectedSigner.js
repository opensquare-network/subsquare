import React from "react";
import styled from "styled-components";
import Account from "./account";
import EmptyAccount from "./emptyAccount";
import { GreyPanel } from "./styled/containers/greyPanel";
import { useSetConnectedAddress } from "next-common/context/connectedAddress";
import { CACHE_KEY } from "next-common/utils/constants";

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  justify-content: space-between;
`;

export default function ChangeableConnectedSigner({ signerAccount }) {
  const setConnectedAddress = useSetConnectedAddress();

  const reSelectWallet = () => {
    setConnectedAddress();
    localStorage.removeItem(CACHE_KEY.lastLoginAddress);
  };

  return (
    <Wrapper>
      <div className="flex items-center gap-[16px]">
        {signerAccount ? <Account account={signerAccount} /> : <EmptyAccount />}
      </div>
      <button className="text14Medium text-theme500" onClick={reSelectWallet}>
        Change
      </button>
    </Wrapper>
  );
}
