import React from "react";
import styled from "styled-components";
import SignerSelect from "../../../signerSelect";
import AccountBalance from "./accountBalance";
import { useContext } from "react";
import { StateContext } from "./stateContext";
import useSetSignerAccount from "../../../../utils/hooks/useSetSignerAccount";

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

export default function Signer({ extensionAccounts, useAddressVotingBalance }) {
  const { signerAccount, setSignerAccount } = useContext(StateContext);

  useSetSignerAccount(extensionAccounts, setSignerAccount);

  return (
    <div>
      <LabelWrapper>
        <Label>Address</Label>
        <AccountBalance useAddressVotingBalance={useAddressVotingBalance} />
      </LabelWrapper>
      <SignerSelect
        selectedAccount={signerAccount}
        setSelectedAccount={setSignerAccount}
        extensionAccounts={extensionAccounts}
      />
    </div>
  );
}
