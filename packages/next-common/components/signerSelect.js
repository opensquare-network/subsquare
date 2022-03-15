import React, { useEffect, useState } from "react";
import { web3FromAddress } from "@polkadot/extension-dapp";
import AddressSelect from "./addressSelect";
import { encodeAddressToChain } from "@subsquare/next/services/address";
import { Chains } from "../utils/constants";

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
    const accounts = extensionAccounts?.map(({ address, meta: { name } }) => ({
      address,
      acalaAddress: encodeAddressToChain(address, Chains.acala),
      kusamaAddress: encodeAddressToChain(address, Chains.kusama),
      polkadotAddress: encodeAddressToChain(address, Chains.polkadot),
      karuraAddress: encodeAddressToChain(address, Chains.karura),
      khalaAddress: encodeAddressToChain(address, Chains.khala),
      basiliskAddress: encodeAddressToChain(address, Chains.basilisk),
      kabochaAddress: encodeAddressToChain(address, Chains.kabocha),
      bifrostAddress: encodeAddressToChain(address, Chains.bifrost),
      kintsugiAddress: encodeAddressToChain(address, Chains.kintsugi),
      polkadexAddress: encodeAddressToChain(address, Chains.polkadex),
      name,
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
      web3FromAddress(selectedAccount.address).then((injector) => {
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
