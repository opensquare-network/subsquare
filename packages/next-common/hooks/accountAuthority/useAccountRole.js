import { useMemo } from "react";
import { useUser } from "next-common/context/user";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAccountAuthority from "./useAccountAuthority";
import { resolveAccountRole } from "./resolveAccountRole";

// Combine an origin account's authority structure with the current logged-in
// user, and tell which role (if any) the user plays for dispatching calls
// whose origin must be that account.
//
// @returns { loading, role }
//   role: see resolveAccountRole for possible values; null means the current
//         user cannot dispatch a call for the origin.
export default function useAccountRole(origin) {
  const user = useUser();
  const realAddress = useRealAddress();
  const { loading, ...structure } = useAccountAuthority(origin);

  // The connected account, plus the address the user acts on behalf of
  // (their own address, or their configured proxy delegator when they are a
  // proxy holder).
  const userAddresses = useMemo(
    () => [user?.address, realAddress].filter(Boolean),
    [user?.address, realAddress],
  );

  const role = useMemo(
    () => resolveAccountRole(origin, structure, userAddresses),
    [origin, structure, userAddresses],
  );

  return { loading, role };
}
