import { useEffect, useState } from "react";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

export default function useAccountNonce() {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [accountNonce, setAccountNonce] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress) {
      return;
    }
    setIsLoading(true);
    api.query.system
      .account(signerAccount?.realAddress)
      .then((account) => {
        setAccountNonce(account.nonce.toNumber());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, signerAccount?.realAddress]);

  return { accountNonce, isLoading };
}
