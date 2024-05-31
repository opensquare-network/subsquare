import { useCallback, useEffect } from "react";
import styled from "styled-components";
import AddressSelect from "../addressSelect";
import ErrorText from "../ErrorText";
import SelectWallet from "../wallet/selectWallet";
import {
  getMultiSigWallets,
  getSingleSigWallets,
  getWallets,
} from "../../utils/consts/connect";
import { useChain } from "../../context/chain";
import ErrorMessage from "../styled/errorMessage";
import { noop } from "lodash-es";
import isMixedChain from "next-common/utils/isMixedChain";
import EVMEntryWalletOption from "../wallet/evmEntryWalletOption";
import { useSubstrateAccounts } from "next-common/hooks/connect/useSubstrateAccounts";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { useConnectPopupView } from "next-common/hooks/connect/useConnectPopupView";

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
  wallet,
  setWallet,
  selectedWallet,
  setSelectedWallet,
  selectedAccount,
  setSelectedAccount,
  lastUsedAddress,
}) {
  const chain = useChain();
  const addresses = useSubstrateAccounts({ wallet: selectedWallet });
  const [, setView] = useConnectPopupView();

  useEffect(() => {
    setSelectedAccount();
    if (addresses?.length > 0) {
      if (lastUsedAddress) {
        const account = addresses?.find(
          (item) => item.address === lastUsedAddress,
        );
        if (account) {
          setSelectedAccount(account);
          return;
        }
      }

      setSelectedAccount(addresses[0]);
    }
    setWeb3Error();
  }, [selectedWallet, addresses]);

  const onSelectAccount = useCallback(
    async (account) => {
      setSelectedAccount(account);

      if (
        !getWallets().some(
          ({ extensionName }) => extensionName === selectedWallet,
        )
      ) {
        const extensionDapp = await import("@polkadot/extension-dapp");
        await extensionDapp.web3Enable("subsquare");
        const injector = await extensionDapp.web3FromSource(
          account.meta?.source,
        );
        setWallet(injector);
      }
    },
    [selectedWallet, chain],
  );

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

      {wallet && addresses?.length === 0 && (
        <ErrorMessage>
          Address not detected, please create an available address.
        </ErrorMessage>
      )}

      {selectedWallet && (
        <div>
          <Label>Choose linked address</Label>
          <AddressSelect
            accounts={addresses}
            selectedAccount={selectedAccount}
            onSelect={onSelectAccount}
          />
          {web3Error && <ErrorText>{web3Error}</ErrorText>}
        </div>
      )}
    </>
  );
}
