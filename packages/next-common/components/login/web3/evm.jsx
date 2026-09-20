import { SystemLoading } from "@osn/icons/subsquare";
import { find } from "lodash-es";
import AddressSelect from "next-common/components/addressSelect";
import WalletEVMOptions from "next-common/components/wallet/options/evm";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import useEVMWalletConnect from "next-common/hooks/connect/useEVMWalletConnect";
import { useEVMWallets } from "next-common/hooks/connect/useEVMWallets";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import PrimaryButton from "next-common/lib/button/primary";
import { metamask } from "next-common/utils/consts/connect";
import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useEffect, useState } from "react";
import { useConnection, useConnect } from "wagmi";
import LoginAddressNotDetectedMessage from "../addressNotDetectedMessage";
import { Label } from "../styled";
import { WalletConnectQrCode } from "./walletconnect";

export default function LoginWeb3EVM() {
  const { lastConnectedAccount } = useConnectedAccountContext();
  const { connector, isConnected } = useConnection();
  const { mutate, isError, isPending: isConnecting } = useConnect();
  const [selectedAccount, setSelectedAccount] = useState();
  const { accounts } = useEVMAccounts();
  const wallets = useEVMWallets();
  const walletConnect = useEVMWalletConnect(
    find(wallets, ["connector.id", "walletConnect"])?.connector,
  );
  const connectedWallet = find(wallets, ["connector.id", connector?.id]);
  const [web3Login, web3Loading] = useWeb3Login();

  const [selectedWallet, setSelectedWallet] = useState();
  useEffect(() => {
    if (selectedWallet?.connector?.id === connectedWallet?.connector?.id) {
      return;
    }
    setSelectedWallet(connectedWallet);
  }, [connectedWallet, selectedWallet]);
  useEffect(() => {
    setSelectedWallet(connectedWallet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    const lastUsedAddress = find(accounts, {
      address: lastConnectedAccount?.address,
    });

    if (lastUsedAddress) {
      setSelectedAccount(lastUsedAddress);
    } else if (accounts?.length > 0) {
      setSelectedAccount(accounts?.[0]);
    } else {
      setSelectedAccount();
    }
  }, [accounts, lastConnectedAccount?.address]);

  async function handleSelectWallet(wallet) {
    if (wallet.connector.id === connector?.id && isConnected) {
      setSelectedWallet(wallet);
      return;
    }

    if (wallet.connector.id === "walletConnect") {
      await walletConnect.open(async ({ accounts: addresses }) => {
        const [account] = normalizedMetaMaskAccounts(
          addresses,
          wallet.connector.id,
        );
        await web3Login({ account, wallet: metamask.extensionName });
      });
      return;
    }

    mutate(
      { connector: wallet.connector },
      {
        onSuccess() {
          setSelectedWallet(wallet);
        },
      },
    );
  }

  if (walletConnect.isOpen) {
    return (
      <WalletConnectQrCode
        uri={walletConnect.uri}
        backTitle="Back to EVM"
        onBack={walletConnect.close}
      />
    );
  }

  return (
    <div className="space-y-6">
      <WalletEVMOptions
        selectedWallet={selectedWallet}
        onSelect={handleSelectWallet}
      />

      {isConnecting && (
        <div className="flex justify-center">
          <SystemLoading className="text-textDisabled" />
        </div>
      )}

      {isConnected && !!accounts.length && (
        <>
          <div>
            <Label>Choose linked address</Label>

            <AddressSelect
              accounts={accounts}
              onSelect={setSelectedAccount}
              selectedAccount={selectedAccount}
            />
          </div>

          <div>
            <PrimaryButton
              className="w-full"
              onClick={() => {
                web3Login({
                  account: selectedAccount,
                  wallet: metamask.extensionName,
                });
              }}
              disabled={web3Loading}
            >
              Next
            </PrimaryButton>
          </div>
        </>
      )}

      {isConnected && !accounts.length && <LoginAddressNotDetectedMessage />}
    </div>
  );
}
