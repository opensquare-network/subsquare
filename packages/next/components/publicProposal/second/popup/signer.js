import styled from "styled-components";
import SignerSelect from "next-common/components/signerSelect";
import AccountBalance from "./accountBalance";

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

export default function Signer({
  extensionAccounts,
  chain,
  api,
  selectedAccount,
  setSelectedAccount,
  balance,
  setBalance,
}) {
  return (
    <div>
      <LabelWrapper>
        <Label>Address</Label>
        <AccountBalance
          account={selectedAccount}
          chain={chain}
          balance={balance}
          setBalance={setBalance}
        />
      </LabelWrapper>
      <SignerSelect
        api={api}
        chain={chain}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        extensionAccounts={extensionAccounts}
      />
    </div>
  );
}
