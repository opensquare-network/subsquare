import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAccountAuthority from "./useAccountAuthority";
import { resolveAccountRoles } from "./resolveAccountRole";

// Resolve how the current user's real address can dispatch calls whose
// origin must be `origin`.
//
// @returns { loading, roles, role, authority }
//   roles: every valid route from resolveAccountRoles; [] = cannot dispatch.
//   role:  the preferred role, i.e. roles[0] ?? null.
//   authority: the account authority of `origin` ({ multisig, delegates }),
//     including multisig routes the current user is NOT a member of; useful
//     for e.g. detecting operations initiated by others.
export default function useAccountRole(origin) {
  const realAddress = useRealAddress();

  // useAccountAuthority memoizes its result, so reuse that object directly as
  // `authority`. Spreading it into a new object here would create a fresh
  // reference on every render and break consumers that use it in effect deps
  // (causing an infinite effect loop).
  const authority = useAccountAuthority(origin);
  const { loading } = authority;

  const roles = useMemo(
    () => resolveAccountRoles(origin, authority, realAddress),
    [origin, authority, realAddress],
  );

  const role = useMemo(() => roles[0] ?? null, [roles]);

  return { loading, role, roles, authority };
}
