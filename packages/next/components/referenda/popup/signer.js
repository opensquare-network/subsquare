import SignerSelect from "next-common/components/signerSelect";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import useSetDefaultSigner from "next-common/utils/hooks/useSetDefaultSigner";
import { useChainSettings } from "next-common/context/chain";

export default function Signer({
  api,
  votingIsLoading,
  votingBalance,
  selectedAccount,
  setSelectedAccount,
  isLoading,
  extensionAccounts,
}) {
  const node = useChainSettings();
  useSetDefaultSigner(extensionAccounts, setSelectedAccount);

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
        api={api}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        disabled={isLoading}
        extensionAccounts={extensionAccounts}
      />
    </div>
  );
}
