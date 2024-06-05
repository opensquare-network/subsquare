import { useAccount, useConnect } from "wagmi";
import PrimaryButton from "next-common/lib/button/primary";
import AddressSelect from "../../addressSelect";
import { useEffect, useState } from "react";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { find } from "lodash-es";
import { SystemLoading } from "@osn/icons/subsquare";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import ErrorMessage from "next-common/components/styled/errorMessage";
import SelectWallet from "next-common/components/wallet/selectWallet";
import { useEVMWallets } from "next-common/hooks/connect/useEVMWallets";
import { metamask } from "next-common/utils/consts/connect";

export default function LoginEVMForm() {
  const { lastConnectedAccount } = useConnectedAccountContext();
  const { connector, isConnecting, isConnected } = useAccount();
  const { connect, isError } = useConnect();
  const [selectedAccount, setSelectedAccount] = useState();
  const { accounts } = useEVMAccounts();
  const evmWallets = useEVMWallets();
  const connectedWallet = find(evmWallets, ["connector.id", connector?.id]);

  const [selectedWallet, setSelectedWallet] = useState();
  useEffect(() => {
    if (selectedWallet) {
      return;
    }

    setSelectedWallet(connectedWallet);
  }, [connectedWallet]);
  useEffect(() => {
    setSelectedWallet(connectedWallet);
  }, [isError]);

  const [web3Login, isLoading] = useWeb3Login();

  useEffect(() => {
    const lastUsedAddress = find(accounts, {
      address: lastConnectedAccount?.address,
    });

    if (lastUsedAddress) {
      setSelectedAccount(lastUsedAddress);
    } else if (accounts?.length > 0) {
      setSelectedAccount(accounts?.[0]);
    }
  }, [accounts]);

  return (
    <div>
      <div className="text14Bold text-textPrimary mb-2">EVM Wallet</div>

      <div className="space-y-6">
        <SelectWallet
          wallets={evmWallets}
          selectedWallet={selectedWallet}
          onSelect={(wallet) => {
            connect(
              { connector: wallet.connector },
              {
                onSuccess() {
                  setSelectedWallet(wallet);
                },
              },
            );
          }}
        />

        {isConnecting && (
          <div className="flex justify-center">
            <SystemLoading className="text-textDisabled" />
          </div>
        )}

        {isConnected && !!accounts.length && (
          <>
            <div>
              <div className="text12Bold text-textPrimary mb-2">
                Choose linked address
              </div>

              <AddressSelect
                accounts={accounts}
                onSelect={setSelectedAccount}
                selectedAccount={selectedAccount}
              />
            </div>

            <div>
              <PrimaryButton
                className="w-full"
                loading={isLoading}
                onClick={() => {
                  web3Login({
                    account: selectedAccount,
                    wallet: metamask.extensionName,
                  });
                }}
              >
                Next
              </PrimaryButton>
            </div>
          </>
        )}

        {isConnected && !accounts.length && (
          <ErrorMessage>
            Address not detected, please create an available address.
          </ErrorMessage>
        )}
      </div>
    </div>
  );
}
