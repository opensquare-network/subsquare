import SignerSelect from "next-common/components/signerSelect";
import Loading from "next-common/components/loading";
import {
  Label,
  LabelWrapper,
  BalanceWrapper,
} from "next-common/components/popup/styled";

export default function Signer({
  api,
  chain,
  isLoading,
  extensionAccounts,
  selectedAccount,
  setSelectedAccount,
  votingIsLoading,
  setInputVoteBalance,
  votingBalance,
}) {
  return (
    <div>
      <LabelWrapper>
        <Label>Address</Label>
        <BalanceWrapper>
          <div>Voting Balance</div>
          {!votingIsLoading && (
            <div
              className="balance"
              onClick={() => setInputVoteBalance(votingBalance ?? 0)}
            >
              {votingBalance ?? 0}
            </div>
          )}
          {votingIsLoading && <Loading />}
        </BalanceWrapper>
      </LabelWrapper>
      <SignerSelect
        api={api}
        chain={chain}
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        disabled={isLoading}
      />
    </div>
  );
}
