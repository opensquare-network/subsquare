import React from "react";
import styled from "styled-components";
import Account from "./account";
import EmptyAccount from "./emptyAccount";
import { GreyPanel } from "./styled/containers/greyPanel";

const Wrapper = styled(GreyPanel)`
  padding: 12px 16px;
  gap: 16px;
`;

export default function ConnectedSigner({ signerAccount }) {
  return (
    <Wrapper>
      {signerAccount ? <Account account={signerAccount} /> : <EmptyAccount />}
    </Wrapper>
  );
}
