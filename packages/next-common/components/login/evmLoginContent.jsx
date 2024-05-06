import { useAccount, useConnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import PrimaryButton from "next-common/lib/button/primary";
import WalletOption from "../wallet/walletOption";
import AddressSelect from "../addressSelect";
import { normalizedMetaMaskAccounts } from "next-common/utils/metamask";
import { useEffect, useMemo, useState } from "react";
import { useWeb3Login } from "next-common/hooks/connect/web3Login";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useEVMWalletOptions } from "next-common/hooks/connect/useEVMWalletOptions";

export default function LoginEVMLoginContent() {
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
  const { connect } = useConnect();
  const [selectedWallet, setSelectedWallet] = useState(connector);
  const [selectedAccount, setSelectedAccount] = useState();
  const normalizedAddress = useMemo(
    () => normalizedMetaMaskAccounts(addresses || []),
    [addresses],
  );

  const [web3Login, isLoading] = useWeb3Login();

  useEffect(() => {
    if (normalizedAddress.length > 0) {
      setSelectedAccount(normalizedAddress[0]);
    }
  }, [normalizedAddress]);

  const evmOptions = useEVMWalletOptions();

  const walletOptions = evmOptions.map((option) => (
    <WalletOption
      key={option.extensionName}
      installed
      selected={selectedWallet === option.extensionName}
      onClick={() => {
        connect(
          { connector: option.connector },
          {
            onSuccess() {
              setSelectedWallet(option.extensionName);
            },
          },
        );
      }}
    >
      <div className="flex items-center">
        {option?.logo && <option.logo className="w-6 h-6" />}
        {option.title}
      </div>
    </WalletOption>
  ));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">{walletOptions}</div>

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
            dispatch(setConnectPopupView(CONNECT_POPUP_VIEWS.ACCOUNT));
          }}
        >
          account
        </span>
      </div>
    </div>
  );
}
