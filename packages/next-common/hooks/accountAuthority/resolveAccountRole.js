import { isNil } from "lodash-es";
import { isSameAddress } from "next-common/utils/isSameAddress";

// Describe the "shape" of an account from its authority structure, i.e. the
// ways a transaction can be dispatched with this account as the origin.
//
// The classification is structural (based on on-chain data) and chain
// agnostic: it does not try to look up the backend "pure account" index, it
// only reflects who can act on behalf of the address. In particular:
//   - a "pure proxy" account has no private key and can only be reached
//     through its proxy delegate(s);
//   - a "pure proxy to multisig" account is a pure proxy whose delegate is a
//     multisig account.
//
// @param structure  e.g. from useAccountAuthority: { multisig, delegates }
// @returns flags describing the account, plus the multisig that ultimately
//          controls it (the account itself, or its delegate multisig).
export function classifyAccountAuthority({ multisig, delegates = [] }) {
  const delegateMultisigs = delegates.filter((delegate) => delegate?.multisig);
  const simpleDelegates = delegates.filter((delegate) => !delegate?.multisig);
  const hasDelegates = delegates.length > 0;

  return {
    // The account itself is a multisig account.
    isMultisigAccount: Boolean(multisig),
    // The account has proxy delegates that can act on its behalf.
    hasProxyDelegate: hasDelegates,
    // Pure proxy: no own key path, reached through plain (keyed) delegates.
    isPureProxy: Boolean(
      !multisig && simpleDelegates.length > 0 && delegateMultisigs.length === 0,
    ),
    // Pure proxy backed by a multisig: reached through a multisig delegate.
    isPureProxyToMultisig: Boolean(!multisig && delegateMultisigs.length > 0),
    // Plain address: not a multisig and has no proxy delegates.
    isSimple: Boolean(!multisig && !hasDelegates),
    // The multisig that ultimately controls this account (itself, or its
    // delegate multisig), if any.
    controllingMultisig: multisig || delegateMultisigs[0]?.multisig || null,
  };
}

// Route priority (lower = preferred; roles[0] is the default).
const ROUTE_PRIORITY = {
  direct: 0,
  "multisig:direct": 1, // origin itself is the multisig
  proxy: 2, // a keyed delegate of the origin
  "multisig:proxy": 3, // a delegate multisig of the origin
};

function routePriority(role) {
  if (role?.kind === "direct") {
    return ROUTE_PRIORITY.direct;
  }
  if (role?.kind === "proxy") {
    return ROUTE_PRIORITY.proxy;
  }
  return role?.viaProxy
    ? ROUTE_PRIORITY["multisig:proxy"]
    : ROUTE_PRIORITY["multisig:direct"];
}

// All ways a user can dispatch a call whose origin must be `origin`. A user
// may have several valid routes at once (e.g. a pure proxy delegating to
// several multisigs the user is a signatory of), so we return the full list,
// ordered by ROUTE_PRIORITY, instead of a single winner.
//
// A plain account signs directly; a pure proxy (no key) is dispatched through
// its delegate in Proxy.Proxies(origin) via proxy.proxy(origin, call). The
// user either IS the origin account (a multisig wallet rewrites the
// signature, so we do NOT build asMulti), or is one of its signatories (then
// the app must build the multisig transaction).
//
// @param origin          the account that must be the transaction origin
// @param structure       resolved by useAccountAuthority: { multisig, delegates }
// @param userAddress     the address the current user can sign with
//
// @returns Role[], ordered by ROUTE_PRIORITY (roles[0] is the default). Each
//          item is self-contained:
//   { kind: "direct" }
//   { kind: "proxy", proxy }
//   { kind: "multisig", multisig, viaProxy }
//     - viaProxy=false: origin itself is the multisig
//     - viaProxy=true:  origin is behind the delegate multisig
export function resolveAccountRoles(origin, structure, userAddress) {
  if (isNil(origin) || !structure) {
    return [];
  }

  const userIs = (address) => isSameAddress(address, userAddress);

  const isUserASignatory = (multisig) =>
    (multisig?.signatories || []).some((signatory) => userIs(signatory));

  const roles = [];

  // 1. User is the origin itself (a multisig wallet handles asMulti).
  if (userIs(origin)) {
    roles.push({ kind: "direct" });
  }

  // 2. User is a signatory of the origin multisig.
  if (structure.multisig && isUserASignatory(structure.multisig)) {
    roles.push({
      kind: "multisig",
      multisig: structure.multisig,
      viaProxy: false,
    });
  }

  // 3. Routes through the origin's proxy delegate(s).
  for (const delegate of structure.delegates || []) {
    //    - user is a signatory of a multisig delegate.
    if (delegate?.multisig && isUserASignatory(delegate.multisig)) {
      roles.push({
        kind: "multisig",
        multisig: delegate.multisig,
        viaProxy: true,
      });
    }

    //    - user IS the delegate itself.
    if (userIs(delegate?.delegate)) {
      roles.push({ kind: "proxy", proxy: delegate.delegate });
    }
  }

  // Stable sort: same-priority routes keep the on-chain delegate order.
  return roles.sort((a, b) => routePriority(a) - routePriority(b));
}

// Preferred role (roles[0]) for callers that only need a default. Use
// resolveAccountRoles to get every valid route.
export function resolveAccountRole(origin, structure, userAddress) {
  return resolveAccountRoles(origin, structure, userAddress)[0] ?? null;
}
