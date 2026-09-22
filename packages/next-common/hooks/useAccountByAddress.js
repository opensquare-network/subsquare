import { useMemo } from "react";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { addressEllipsis, isSameAddress } from "next-common/utils";

// Resolve an address to the wallet account that owns it. Addresses owned by no
// loaded wallet, e.g. a watch-only or a mock account, fall back to a plain
// account so they can still be displayed and used as an origin.
export default function useAccountByAddress(address) {
  const extensionAccounts = useExtensionAccounts();
  const signerAccount = useSignerAccount();
  const meta = signerAccount?.meta;

  return useMemo(() => {
    if (!address) {
      return null;
    }

    const account = extensionAccounts?.find((item) =>
      isSameAddress(item.address, address),
    );

    return (
      account || {
        address,
        name: addressEllipsis(address),
        meta,
      }
    );
  }, [address, extensionAccounts, meta]);
}
