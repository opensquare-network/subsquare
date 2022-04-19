import styled from "styled-components";
import SignerSelect from "next-common/components/signerSelect";
import AccountBalance from "./accountBalance";
import { useContext } from "react";
import { StateContext } from "./stateContext";

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

export default function Signer({ extensionAccounts, chain, api }) {
  const { signerAccount, setSignerAccount } = useContext(StateContext);

  return (
    <div>
      <LabelWrapper>
        <Label>Address</Label>
        <AccountBalance chain={chain} />
      </LabelWrapper>
      <SignerSelect
        api={api}
        chain={chain}
        selectedAccount={signerAccount}
        setSelectedAccount={setSignerAccount}
        extensionAccounts={extensionAccounts}
      />
    </div>
  );
}
