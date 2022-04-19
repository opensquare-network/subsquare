import styled from "styled-components";
import SignerSelect from "next-common/components/signerSelect";
import PopupLabel from "next-common/components/popup/label";
import { WarningMessage } from "next-common/components/popup/styled";

const Wrapper = styled.div`
  > :last-child {
    margin-top: 8px;
  }
`;

export default function Signer({
  api,
  chain,
  extensionAccounts,
  selectedAccount,
  setSelectedAccount,
  selectedAccountCanVote,
}) {
  return (
    <Wrapper>
      <PopupLabel text={"Address"} />
      <SignerSelect
        api={api}
        chain={chain}
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />
      {!selectedAccountCanVote && (
        <WarningMessage danger={!selectedAccountCanVote}>
          Only council members can vote.
        </WarningMessage>
      )}
    </Wrapper>
  );
}
