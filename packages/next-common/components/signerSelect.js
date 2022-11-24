import React, { useEffect, useState } from "react";
import AddressSelect from "./addressSelect";
import { useChain } from "../context/chain";
import useApi from "../utils/hooks/useApi";

export default function SignerSelect({
  extensionAccounts,
  selectedAccount,
  setSelectedAccount,
  disabled,
}) {
  const api = useApi();
  const chain = useChain();
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
      import("@polkadot/extension-dapp").then(({ web3FromSource }) => {
        web3FromSource(selectedAccount.meta?.source).then((injector) => {
          api.setSigner(injector.signer);
        });
      });
    }
  }, [api, selectedAccount]);

  return (
    <AddressSelect
      accounts={accounts}
      selectedAccount={selectedAccount}
      onSelect={setSelectedAccount}
      disabled={disabled}
    />
  );
}
