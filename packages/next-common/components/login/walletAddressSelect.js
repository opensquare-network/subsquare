import { useEffect } from "react";
import styled from "styled-components";
import AddressSelect from "../addressSelect";
import ErrorText from "../ErrorText";
import SelectWallet from "../wallet/selectWallet";
import { getMultiSigWallets, getSingleSigWallets, } from "../../utils/consts/connect";
import { noop } from "lodash-es";
import isMixedChain from "next-common/utils/isMixedChain";
import EVMEntryWalletOption from "../wallet/evmEntryWalletOption";
import { useSubstrateAccounts } from "next-common/hooks/connect/useSubstrateAccounts";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useConnectPopupView } from "next-common/hooks/connect/useConnectPopupView";
import Loading from "../loading";

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  :not(:first-child) {
    margin-top: 16px;
  }
  color: var(--textPrimary);
`;

export default function WalletAddressSelect({
  web3Error,
  setWeb3Error = noop,
  selectedWallet,
  setSelectedWallet,
  selectedAccount,
  setSelectedAccount,
  lastUsedAddress,
}) {
  const { accounts: accounts, loading } = useSubstrateAccounts({
    wallet: selectedWallet,
  });
  const [, setView] = useConnectPopupView();

  useEffect(() => {
    setSelectedAccount();
    if (accounts?.length > 0) {
      if (lastUsedAddress) {
        const account = accounts?.find(
          (item) => item.address === lastUsedAddress,
        );
        if (account) {
          setSelectedAccount(account);
          return;
        }
      }

      setSelectedAccount(accounts[0]);
    }
    setWeb3Error();
  }, [selectedWallet, accounts]);

  const multisigWallets = getMultiSigWallets();

  return (
    <>
      <div className="flex flex-col gap-[8px]">
        <div className="text14Bold text-textPrimary">SingleSig Wallet</div>
        <SelectWallet
          wallets={getSingleSigWallets()}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
          extraWallets={
            isMixedChain() && (
              <EVMEntryWalletOption
                onClick={() => {
                  setView(CONNECT_POPUP_VIEWS.EVM);
                }}
              />
            )
          }
        />
      </div>

      {multisigWallets?.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <div className="text14Bold text-textPrimary">MultiSig Wallet</div>
          <SelectWallet
            wallets={multisigWallets}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center w-full">
          <Loading size={20} />
        </div>
      ) : (
        selectedWallet && (
          <div>
            <Label>Choose linked address</Label>
            <AddressSelect
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelect={setSelectedAccount}
            />
            {web3Error && <ErrorText>{web3Error}</ErrorText>}
          </div>
        )
      )}
    </>
  );
}
