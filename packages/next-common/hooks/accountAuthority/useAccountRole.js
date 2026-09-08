import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAccountAuthority from "./useAccountAuthority";
import { resolveAccountRoles } from "./resolveAccountRole";

// Resolve how the current user's real address can dispatch calls whose
// origin must be `origin`.
//
// @returns { loading, roles, role }
//   roles: every valid route from resolveAccountRoles; [] = cannot dispatch.
//   role:  the preferred role, i.e. roles[0] ?? null.
export default function useAccountRole(origin) {
  const realAddress = useRealAddress();
  const { loading, ...structure } = useAccountAuthority(origin);

  const roles = useMemo(
    () => resolveAccountRoles(origin, structure, realAddress),
    [origin, structure, realAddress],
  );

  const role = useMemo(() => roles[0] ?? null, [roles]);

  return { loading, role, roles };
}
