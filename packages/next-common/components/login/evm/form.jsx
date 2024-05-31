import { useAccount, useConnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import PrimaryButton from "next-common/lib/button/primary";
import AddressSelect from "../../addressSelect";
import { useEffect, useState } from "react";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { find } from "lodash-es";
import { SystemLoading } from "@osn/icons/subsquare";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useAccounts } from "next-common/hooks/connect/evm/useAccounts";
import ErrorMessage from "next-common/components/styled/errorMessage";
import SelectWallet from "next-common/components/wallet/selectWallet";
import { useEVMWalletOptions } from "next-common/hooks/connect/useEVMWalletOptions";

export default function LoginEVMForm() {
  const dispatch = useDispatch();
  const { lastConnectedAccount } = useConnectedAccountContext();
  const { connector, isConnecting, isConnected } = useAccount();
  const { connect, isError } = useConnect();
  const [selectedAccount, setSelectedAccount] = useState();
  const accounts = useAccounts();
  const evmWallets = useEVMWalletOptions();
  const connectedWallet = find(evmWallets, (w) => {
    return w.connector.id === connector.id;
  });
  const [selectedWallet, setSelectedWallet] = useState(connectedWallet);

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

  useEffect(() => {
    setSelectedWallet(connectedWallet);
  }, [isError]);

  function handleConnect() {
    web3Login({
      account: selectedAccount,
      wallet: WalletTypes.METAMASK,
    });
  }

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
                  handleConnect();
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

        <div className="text14Medium text-center text-textSecondary">
          Login with{" "}
          <span
            className="text-theme500"
            role="button"
            onClick={() => {
              dispatch(setConnectPopupView(CONNECT_POPUP_VIEWS.ACCOUNT));
            }}
          >
            account
          </span>
        </div>
      </div>
    </div>
  );
}
