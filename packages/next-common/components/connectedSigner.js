import React from "react";
import styled from "styled-components";
import Account from "./account";
import EmptyAccount from "./emptyAccount";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;

  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;
`;

export default function ConnectedSigner({ selectedAccount }) {
  return (
    <Wrapper>
      {selectedAccount ? (
        <Account account={selectedAccount} />
      ) : (
        <EmptyAccount />
      )}
    </Wrapper>
  );
}
