import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useMyIdentityType() {
  const api = useContextApi();
  const address = useRealAddress();
  const [type, setType] = useState(null);
  const [parent, setParent] = useState(null);
  const [subName, setSubName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api || !address || !api.query.identity) {
      return;
    }

    setIsLoading(true);
    api.query.identity
      ?.superOf(address)
      .then(async (superOf) => {
        if (superOf.isSome) {
          const [mainAddr, name] = superOf.unwrap();
          setType("sub");
          setParent(mainAddr.toJSON());
          setSubName(name.isRaw ? name.asRaw.toHuman() : null);
        } else {
          const identity = await api.query.identity?.identityOf(address);
          setType(identity.isSome ? "direct" : "none");
          setParent(null);
          setSubName(null);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setType(null);
        setIsLoading(false);
      });
  }, [api, address]);

  return { type, parent, subName, isLoading };
}
