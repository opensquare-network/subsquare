import { useWalletConnect } from "next-common/context/walletconnect";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { normalizedSubstrateAccounts } from "next-common/utils/substrate";
import { useEffect, useState } from "react";

export function useWalletConnectAccounts() {
  const { fetchAddresses } = useWalletConnect();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAddresses().then((addresses) => {
      setAccounts(
        normalizedSubstrateAccounts(
          addresses.map((address) => {
            return { address };
          }),
          WalletTypes.WALLETCONNECT,
        ),
      );
    });
  }, [fetchAddresses]);

  return accounts;
}
