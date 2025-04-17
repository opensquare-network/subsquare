import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

function convertIdentityInfo(identityInfo) {
  if (!identityInfo) {
    return null;
  }

  return {
    display: identityInfo?.display?.Raw || null,
    legal: identityInfo?.legal,
    email: identityInfo?.email?.Raw || null,
    matrix: identityInfo?.matrix?.Raw || null,
    web: identityInfo?.web,
    twitter: identityInfo?.twitter,
    github: identityInfo?.github,
    discord: identityInfo?.discord,
  };
}

export default function useSubMyIdentityInfo(address) {
  const api = useContextApi();
  const [identityDeposit, setIdentityDeposit] = useState(null);
  const [identityInfo, setIdentityInfo] = useState(null);

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
        const indentityInfo = identityOf?.info?.toHuman() || "";
        const convertedInfo = convertIdentityInfo(indentityInfo);

        setIdentityInfo(convertedInfo);
        setIdentityDeposit(identityOf.deposit.toString() || "0");
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address]);

  return {
    identityInfo,
    identityDeposit,
  };
}
