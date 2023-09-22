import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import AddressSelect from "../addressSelect";
import ErrorText from "../ErrorText";
import SelectWallet from "../wallet/selectWallet";
import { getWallets } from "../../utils/consts/connect";
import { useChain } from "../../context/chain";
import ErrorMessage from "../styled/errorMessage";

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  :not(:first-child) {
    margin-top: 16px;
  }
  color: var(--textPrimary);
`;

export default function SelectWalletAddress({
  web3Error,
  setWeb3Error,
  wallet,
  setWallet,
  selectedWallet,
  setSelectWallet,
  selectedAccount,
  setSelectedAccount,
  lastUsedAddress,
}) {
  const chain = useChain();
  const [accounts, setAccounts] = useState([]);

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

  return (
    <>
      <SelectWallet
        selectedWallet={selectedWallet}
        setSelectWallet={setSelectWallet}
        setAccounts={setAccounts}
        setWallet={setWallet}
      />

      {wallet && accounts?.length === 0 && (
        <ErrorMessage>
          Address not detected, please create an available address.
        </ErrorMessage>
      )}

      {selectedWallet && (
        <div>
          <Label>Choose linked address</Label>
          <AddressSelect
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelect={onSelectAccount}
          />
          {web3Error && <ErrorText>{web3Error}</ErrorText>}
        </div>
      )}
    </>
  );
}
