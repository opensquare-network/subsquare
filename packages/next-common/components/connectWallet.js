import React from "react";
import { useState } from "react";
import styled from "styled-components";
import PopupWithoutTitle from "./popup/wrapper/PopupWithoutTitle";
import SelectWallet from "./wallet/selectWallet";

const Title = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`;

const ContentWrapper = styled.div`
  ul {
    all: unset;
  }
`;

export default function ConnectWallet({ onClose }) {
  const [selectedWallet, setSelectWallet] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [wallet, setWallet] = useState();

  return (
    <PopupWithoutTitle onClose={onClose}>
      <ContentWrapper>
        <Title>Connect Wallet</Title>
        <SelectWallet
          selectedWallet={selectedWallet}
          setSelectWallet={setSelectWallet}
          setAccounts={setAccounts}
          setWallet={setWallet}
        />
      </ContentWrapper>
    </PopupWithoutTitle>
  );
}
