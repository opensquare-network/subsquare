import SignerSelect from "next-common/components/signerSelect";
import { toPrecision } from "utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";

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
      <PopupLabelWithBalance
        text="Address"
        isLoading={votingIsLoading}
        balanceName="Voting balance"
        balance={toPrecision(votingBalance ?? 0, node.decimals)}
        symbol={node.symbol}
      />
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
