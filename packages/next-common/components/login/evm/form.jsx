import { useAccount, useConnect, useConnections } from "wagmi";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import PrimaryButton from "next-common/lib/button/primary";
import WalletOption from "../../wallet/walletOption";
import AddressSelect from "../../addressSelect";
import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useEffect, useMemo, useState } from "react";
import { useWeb3Login } from "next-common/hooks/connect/web3Login";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useEVMWalletOptions } from "next-common/hooks/connect/useEVMWalletOptions";
import { find } from "lodash-es";

export default function LoginEVMForm() {
  const dispatch = useDispatch();
  const account = useAccount();
  const connections = useConnections();
  const { connect } = useConnect();
  const [selectedConnector, setSelectedConnector] = useState(account.connector);
  const connection = find(connections, ["connector.id", selectedConnector.id]);

  const addresses = connection?.accounts?.length
    ? connection?.accounts
    : account.addresses.length
    ? account.addresses
    : [];

  const [selectedAccount, setSelectedAccount] = useState();
  const normalizedAddresses = useMemo(
    () => normalizedMetaMaskAccounts(addresses || []),
    [addresses],
  );

  const [web3Login, isLoading] = useWeb3Login();

  useEffect(() => {
    if (normalizedAddresses.length > 0) {
      setSelectedAccount(normalizedAddresses[0]);
    }
  }, [normalizedAddresses]);

  const evmOptions = useEVMWalletOptions();

  const walletOptions = evmOptions.map((option) => {
    let icon;
    if (option.logo) {
      icon = <option.logo className="w-6 h-6" />;
    } else if (option.connector.icon) {
      icon = <img src={option.connector.icon} className="w-6 h-6" />;
    }

    return (
      <WalletOption
        key={option.extensionName}
        installed
        selected={selectedConnector?.id === option.connector.id}
        onClick={() => {
          if (connection.accounts.length) {
            setSelectedConnector(option.connector);
          } else {
            connect(
              { connector: option.connector },
              {
                onSuccess() {
                  setSelectedConnector(option.connector);
                },
              },
            );
          }
        }}
      >
        <div className="flex items-center">
          {icon}
          {option.title}
        </div>
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

        {selectedConnector && (
          <>
            <div>
              <div className="text12Bold text-textPrimary mb-2">
                Choose linked address
              </div>

              <AddressSelect
                accounts={normalizedAddresses}
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
