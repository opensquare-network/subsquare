import { useAccount, useConnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import PrimaryButton from "next-common/lib/button/primary";
import WalletOption from "../../wallet/walletOption";
import AddressSelect from "../../addressSelect";
import { useEffect, useState } from "react";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { CACHE_KEY, CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useEVMWalletOptions } from "next-common/hooks/connect/useEVMWalletOptions";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { find } from "lodash-es";
import { SystemLoading } from "@osn/icons/subsquare";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useAccounts } from "next-common/hooks/connect/evm/useAccounts";
import { useLocalStorage } from "react-use";
import { useLastConnector } from "next-common/hooks/connect/evm/useLastConnector";

export default function LoginEVMForm() {
  const dispatch = useDispatch();
  const { lastConnectedAccount } = useConnectedAccountContext();
  const { addresses, connector, isConnecting, isConnected } = useAccount();
  const { connect, isError } = useConnect();
  const lastConnector = useLastConnector();
  const [selectedConnector, setSelectedConnector] = useState(lastConnector);
  const [selectedAccount, setSelectedAccount] = useState();
  const accounts = useAccounts({ connector: selectedConnector });
  const [, setLastEVMConnectedAddresses] = useLocalStorage(
    CACHE_KEY.lastEVMConnectedAddresses,
  );
  const [, setLastEVMConnectorID] = useLocalStorage(
    CACHE_KEY.lastEVMConnectorID,
  );

  const [web3Login, isLoading] = useWeb3Login();

  useEffect(() => {
    const lastUsedAddress = find(accounts, {
      address: lastConnectedAccount?.address,
    });

    if (lastUsedAddress) {
      setSelectedAccount(lastUsedAddress);
    } else if (accounts.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts]);

  useEffect(() => {
    setSelectedConnector(connector);
  }, [isError]);

  function handleConnect() {
    web3Login({
      account: selectedAccount,
      wallet: WalletTypes.METAMASK,
    }).then(() => {
      setLastEVMConnectedAddresses(addresses);
      setLastEVMConnectorID(connector.id);
    });
  }

  const evmOptions = useEVMWalletOptions();

  const walletOptions = evmOptions.map((option) => {
    let icon;
    if (option.logo) {
      icon = <option.logo className="w-6 h-6" />;
    } else if (option.connector.icon) {
      icon = <img src={option.connector.icon} className="w-6 h-6" />;
    }

    const installed = !!option.connector;

    return (
      <WalletOption
        key={option.extensionName}
        installed={installed}
        selected={selectedConnector?.id === option.connector?.id}
        onClick={() => {
          if (!installed) {
            return;
          }

          connect(
            { connector: option.connector },
            {
              onSuccess() {
                setSelectedConnector(option.connector);
              },
            },
          );
        }}
      >
        <div className="flex items-center">
          {icon}
          {option.title}
        </div>
        {!installed && (
          <span className="wallet-not-installed">Not installed</span>
        )}
      </WalletOption>
    );
  });

  return (
    <div>
      <div className="text14Bold text-textPrimary mb-2">EVM Wallet</div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {walletOptions}
        </div>

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
