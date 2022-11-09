import SignerSelect from "next-common/components/signerSelect";
import Loading from "next-common/components/loading";
import {
  BalanceWrapper,
  Label,
  LabelWrapper,
} from "next-common/components/popup/styled";
import { toPrecision } from "next-common/utils";
import { formatBalance } from "next-common/utils/viewfuncs";
import useSetDefaultSigner from "next-common/utils/hooks/useSetDefaultSigner";
import { useChainSettings } from "next-common/context/chain";

export default function Signer({
  api,
  isLoading,
  extensionAccounts,
  selectedAccount,
  setSelectedAccount,
  votingIsLoading,
  setInputVoteBalance,
  votingBalance,
  symbol,
}) {
  const node = useChainSettings();
  const balance = toPrecision(votingBalance, node.decimals);

  useSetDefaultSigner(extensionAccounts, setSelectedAccount);

  return (
    <div>
      <LabelWrapper>
        <Label>Address</Label>
        <BalanceWrapper>
          <div>Voting Balance</div>
          {!votingIsLoading && (
            <div
              className="balance"
              onClick={() => setInputVoteBalance(balance ?? 0)}
            >
              {formatBalance(balance, symbol) ?? 0}
            </div>
          )}
          {votingIsLoading && <Loading />}
        </BalanceWrapper>
      </LabelWrapper>
      <SignerSelect
        api={api}
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        disabled={isLoading}
      />
    </div>
  );
}
