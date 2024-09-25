import { usePageProps } from "next-common/context/page";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

/**
 * Hook to get the current user's account address.
 *
 * This hook first checks if there is a specific `id` (address) in the URL, which is assumed to be the
 * account address of a specific user. If the `id` exists, it takes precedence.
 * If no `id` is found in the URL, the hook falls back to the current connected wallet address of the user.
 *
 * @returns {string} - The user's account address, either from the URL or the connected wallet.
 */
export default function useAccountAddress() {
  const { id } = usePageProps();
  const myAddress = useRealAddress();
  const address = id || myAddress;

  return address;
}
