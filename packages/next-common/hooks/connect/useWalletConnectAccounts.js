import { useWalletConnect } from "next-common/context/walletconnect";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { normalizedSubstrateAccounts } from "next-common/utils/substrate";
import { useEffect, useState } from "react";

export function useWalletConnectAccounts() {
  const { fetchAddresses, session } = useWalletConnect();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (session) {
      fetchAddresses().then((addresses) => {
        if (addresses && addresses.length > 0) {
          setAccounts(
            normalizedSubstrateAccounts(
              addresses.map((address) => ({ address })),
              WalletTypes.WALLETCONNECT,
            ),
          );
        }
      });
    }
  }, [session, fetchAddresses]);

  return accounts;
}
