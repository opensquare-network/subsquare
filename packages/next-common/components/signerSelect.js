import React from "react";
import { useState, useEffect } from "react";
import { web3FromAddress } from "@polkadot/extension-dapp";
import AddressSelect from "./addressSelect";
import {
  encodeKaruraAddress,
  encodeKhalaAddress,
  encodeKusamaAddress,
  encodePolkadotAddress,
  encodeBasiliskAddress,
  encodeBifrostAddress,
  encodeAcalaAddress,
  encodeKabochaAddress,
  encodeKintsugiAddress,
} from "../services/address";

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
      kusamaAddress: encodeKusamaAddress(address),
      polkadotAddress: encodePolkadotAddress(address),
      karuraAddress: encodeKaruraAddress(address),
      khalaAddress: encodeKhalaAddress(address),
      basiliskAddress: encodeBasiliskAddress(address),
      bifrostAddress: encodeBifrostAddress(address),
      acalaAddress: encodeAcalaAddress(address),
      kabochaAddress: encodeKabochaAddress(address),
      kintsugiAddress: encodeKintsugiAddress(address),
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
