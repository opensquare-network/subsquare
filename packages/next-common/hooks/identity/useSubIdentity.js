import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubIdentity(address) {
  const api = useContextApi();
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
