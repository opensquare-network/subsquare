import { useAccount, useConnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import PrimaryButton from "next-common/lib/button/primary";
import WalletOption from "../wallet/walletOption";
import AddressSelect from "../addressSelect";
import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { filter } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useWeb3Login } from "next-common/hooks/connect/web3Login";

export default function LoginWeb3EVMLoginContent() {
  return (
    <div className="space-y-6">
      <h3 className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">EVM Address</span>
      </h3>

      <EVMLogin />
    </div>
  );
}

function EVMLogin() {
  const dispatch = useDispatch();
  const { addresses, connector } = useAccount();
  const { connectors, connect } = useConnect();
  const [selectedWallet, setSelectedWallet] = useState(connector);
  const [selectedAccount, setSelectedAccount] = useState();
  const normalizedAddress = useMemo(
    () => normalizedMetaMaskAccounts(addresses || []),
    [addresses],
  );

  const supportedWalletNames = Object.values(WalletTypes);
  const supportedConnectors = filter(connectors, (c) => {
    return supportedWalletNames.includes(c.name.toLowerCase());
  });

  const [web3Login, isLoading] = useWeb3Login();

  useEffect(() => {
    if (normalizedAddress.length > 0) {
      setSelectedAccount(normalizedAddress[0]);
    }
  }, [normalizedAddress]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {supportedConnectors.map((connector) => (
          <WalletOption
            key={connector.id}
            installed
            selected={selectedWallet?.id === connector.id}
            onClick={() => {
              connect(
                { connector },
                {
                  onSuccess() {
                    setSelectedWallet(connector);
                  },
                },
              );
            }}
          >
            <div className="flex items-center">
              <img src={connector.icon} className="w-6 h-6" />
              {connector.name}
            </div>
          </WalletOption>
        ))}
      </div>

      {selectedWallet && (
        <div>
          <div className="text12Bold text-textPrimary mb-2">
            Choose linked address
          </div>

          <AddressSelect
            accounts={normalizedAddress}
            onSelect={setSelectedAccount}
            selectedAccount={selectedAccount}
          />
        </div>
      )}

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

      <div className="text14Medium text-center text-textSecondary">
        Login with{" "}
        <span
          className="text-theme500"
          role="button"
          onClick={() => {
            dispatch(setConnectPopupView("account"));
          }}
        >
          account
        </span>
      </div>
    </div>
  );
}
