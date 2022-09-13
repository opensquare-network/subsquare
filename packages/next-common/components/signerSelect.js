import React, { useEffect, useState } from "react";
import { web3FromSource } from "@polkadot/extension-dapp";
import AddressSelect from "./addressSelect";

export default function SignerSelect({
  chain,
  api,
  extensionAccounts,
  selectedAccount,
  setSelectedAccount,
  disabled,
}) {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const accounts = extensionAccounts?.map(({ address, meta }) => ({
      meta,
      address,
      name: meta.name,
    }));

    setAccounts(accounts || []);
  }, [extensionAccounts]);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [chain, accounts, selectedAccount]);

  useEffect(() => {
    if (api && selectedAccount) {
      web3FromSource(selectedAccount.meta?.source).then((injector) => {
        api.setSigner(injector.signer);
      });
    }
  }, [api, selectedAccount]);

  return (
    <AddressSelect
      chain={chain}
      accounts={accounts}
      selectedAccount={selectedAccount}
      onSelect={setSelectedAccount}
      disabled={disabled}
    />
  );
}
