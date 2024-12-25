import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useSubscribeIdentityDeposit(address) {
  const api = useContextApi();
  const [identityDeposit, setIdentityDeposit] = useState(null);
  const [identityName, setIdentityName] = useState("");
  const [subsDeposit, setSubsDeposit] = useState(null);
  const [subs, setSubs] = useState(null);

  useEffect(() => {
    if (!api || !address || !api.query.identity?.identityOf) {
      return;
    }

    let unsub;
    api.query.identity
      .identityOf(address, (identity) => {
        if (!identity || identity.isNone) {
          setIdentityDeposit(0);
          return;
        }

        const unwrapped = identity.unwrap();
        const identityOf = Array.isArray(unwrapped) ? unwrapped[0] : unwrapped;
        const displayName = identityOf?.info?.display?.asRaw?.toHuman() || "";
        setIdentityName(displayName);
        setIdentityDeposit(identityOf.deposit.toString() || "0");
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address]);

  useEffect(() => {
    if (!api || !address || !api.query.identity?.subsOf) {
      return;
    }

    let unsub;
    api.query.identity
      .subsOf(address, async (subs) => {
        if (!subs || subs[1].length <= 0) {
          setSubsDeposit(0);
          setSubs([]);
        }

        setSubsDeposit(subs[0].toString());
        const subAccounts = subs[1] || [];
        const supers = await api.query.identity.superOf.multi(subAccounts);
        if (!supers) {
          return;
        }
        const normalizedSubs = subAccounts.map((sub, index) => [
          sub.toJSON(),
          supers[index].unwrap()?.[1].asRaw.toHuman(),
        ]);
        setSubs(normalizedSubs);
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address]);

  return {
    identityName,
    identityDeposit,
    subsDeposit,
    subs,
  };
}
