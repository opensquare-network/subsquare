import styled from "styled-components";
import SignerSelect from "next-common/components/signerSelect";
import { toPrecision } from "utils";
import Loading from "next-common/components/loading";
import { Label } from "./styled";

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;
export default function Signer({
  chain,
  node,
  api,
  votingIsLoading,
  votingBalance,
  selectedAccount,
  setSelectedAccount,
  isLoading,
  extensionAccounts,
}) {
  return (
    <div>
      <LabelWrapper>
        <Label>Address</Label>
        <BalanceWrapper>
          <div>Voting Balance</div>
          {!votingIsLoading && (
            <div>{toPrecision(votingBalance ?? 0, node.decimals)}</div>
          )}
          {votingIsLoading && <Loading />}
        </BalanceWrapper>
      </LabelWrapper>
      <SignerSelect
        chain={chain}
        api={api}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        disabled={isLoading}
        extensionAccounts={extensionAccounts}
      />
    </div>
  );
}
