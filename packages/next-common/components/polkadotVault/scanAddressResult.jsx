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
import { useUser } from "next-common/context/user";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import ConfirmRemoreAccountPopup from "./confirmRemoreAccountPopup";

export default function ScanAddressResult() {
  const user = useUser();
  const [web3Login, web3Loading] = useWeb3Login();
  const [selectedAccount, setSelectedAccount] = useState(user?.address);
  const { removeAccount } = usePolkadotVaultAccounts();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();
  const [showConfirmRemoveAccountPopup, setShowConfirmRemoveAccountPopup] =
    useState(false);

  const onRemoveAccount = useCallback(
    (address) => {
      if (isSameAddress(address, user?.address)) {
        setShowConfirmRemoveAccountPopup(true);
        return;
      }

      removeAccount(address);

      if (isSameAddress(address, selectedAccount)) {
        setSelectedAccount(null);
      }
    },
    [removeAccount, selectedAccount, user],
  );

  const onConfirmRemoveAccount = useCallback(async () => {
    await disconnectAccount();
    setSelectedAccount(null);
    removeAccount(selectedAccount);
  }, [disconnectAccount, setSelectedAccount, removeAccount, selectedAccount]);

  const onNextLogin = useCallback(() => {
    web3Login({
      account: { address: selectedAccount },
      wallet: WalletTypes.POLKADOT_VAULT,
    });
  }, [selectedAccount, web3Login]);

  const { accounts } = usePolkadotVaultAccounts();
  if (!accounts.length) {
    return;
  }

  return (
    <div className="space-y-3 text14Medium">
      <WalletGroupTitle>Select Your Scan Result</WalletGroupTitle>
      <div className="scrollbar-pretty overflow-y-auto max-h-[300px] space-y-3">
        {accounts.map((account) => (
          <AccountItem
            className={cn(
              isSameAddress(account.address, selectedAccount) &&
                "bg-neutral200 border-neutral200",
            )}
            user={account}
            key={account?.address}
            onClick={() => setSelectedAccount(account.address)}
            suffix={
              <span
                className="text12Medium text-textTertiary"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveAccount(account.address);
                }}
              >
                <SystemTrash />
              </span>
            }
          />
        ))}
      </div>
      {showConfirmRemoveAccountPopup && (
        <ConfirmRemoreAccountPopup
          onCancel={() => setShowConfirmRemoveAccountPopup(false)}
          onConfirm={onConfirmRemoveAccount}
        />
      )}
      {selectedAccount && (
        <PrimaryButton
          className="w-full"
          onClick={onNextLogin}
          disabled={web3Loading}
        >
          Next
        </PrimaryButton>
      )}
    </div>
  );
}
