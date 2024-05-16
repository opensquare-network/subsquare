import { useAccount, useConnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import PrimaryButton from "next-common/lib/button/primary";
import WalletOption from "../../wallet/walletOption";
import AddressSelect from "../../addressSelect";
import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useEffect, useMemo, useState } from "react";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useEVMWalletOptions } from "next-common/hooks/connect/useEVMWalletOptions";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { find } from "lodash-es";
import { SystemLoading } from "@osn/icons/subsquare";
import WalletTypes from "next-common/utils/consts/walletTypes";

export default function LoginEVMForm() {
  const dispatch = useDispatch();
  const { lastConnectedAccount } = useConnectedAccountContext();
  const {
    addresses: evmAddresses,
    connector,
    isConnecting,
    isConnected,
  } = useAccount();
  const { connect, isError } = useConnect();
  const [selectedConnector, setSelectedConnector] = useState(connector);
  const [selectedAccount, setSelectedAccount] = useState();
  const addresses = useMemo(
    () => normalizedMetaMaskAccounts(evmAddresses || []),
    [evmAddresses],
  );

  const [web3Login, isLoading] = useWeb3Login();

  useEffect(() => {
    if (connector) {
      setSelectedConnector(connector);
    }
  }, [connector]);

  useEffect(() => {
    const lastUsedAddress = find(addresses, {
      address: lastConnectedAccount?.address,
    });

    if (lastUsedAddress) {
      setSelectedAccount(lastUsedAddress);
    } else if (addresses.length > 0) {
      setSelectedAccount(addresses[0]);
    }
  }, [addresses]);

  useEffect(() => {
    setSelectedConnector(connector);
  }, [isError]);

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

        {isConnected && !!addresses.length && (
          <>
            <div>
              <div className="text12Bold text-textPrimary mb-2">
                Choose linked address
              </div>

              <AddressSelect
                accounts={addresses}
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
                    wallet: WalletTypes.METAMASK,
                  });
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
