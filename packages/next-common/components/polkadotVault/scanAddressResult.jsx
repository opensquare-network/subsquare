import { SystemTrash } from "@osn/icons/subsquare";
import { WalletGroupTitle } from "next-common/components/wallet/options/styled";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { usePolkadotVaultAccounts } from "next-common/context/polkadotVault";
import WalletTypes from "next-common/utils/consts/walletTypes";
import PrimaryButton from "next-common/lib/button/primary";
import { useCallback, useState } from "react";
import { cn } from "next-common/utils";
import AccountItem from "../switchAccount/accountItem";
import { isSameAddress } from "next-common/utils";

export default function ScanAddressResult() {
  const [web3Login, web3Loading] = useWeb3Login();
  const [selectedAccount, setSelectedAccount] = useState();
  const { removeAccount } = usePolkadotVaultAccounts();

  const onClick = useCallback((account) => {
    setSelectedAccount(account.address);
  }, []);

  const onRemoveAccount = useCallback(
    (address) => {
      removeAccount(address);

      if (isSameAddress(address, selectedAccount)) {
        setSelectedAccount(null);
      }
    },
    [removeAccount, selectedAccount],
  );

  const { accounts } = usePolkadotVaultAccounts();
  if (!accounts.length) {
    return;
  }

  return (
    <div className="space-y-3 text14Medium">
      <WalletGroupTitle>Select Your Scan Result</WalletGroupTitle>
      {accounts.map((account) => (
        <AccountItem
          className={cn(
            isSameAddress(account.address, selectedAccount) && "bg-neutral200",
          )}
          user={account}
          key={account?.address}
          onClick={() => onClick(account)}
          suffix={
            <span
              className="text12Medium text-textTertiary"
              onClick={() => onRemoveAccount(account.address)}
            >
              <SystemTrash />
            </span>
          }
        />
      ))}
      {selectedAccount && (
        <PrimaryButton
          className="w-full"
          onClick={() => {
            web3Login({
              account: { address: selectedAccount },
              wallet: WalletTypes.POLKADOT_VAULT,
            });
          }}
          disabled={web3Loading}
        >
          Next
        </PrimaryButton>
      )}
    </div>
  );
}
