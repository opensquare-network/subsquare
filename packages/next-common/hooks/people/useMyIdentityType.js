import { useState, useEffect, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export function useIdentityType(api, address) {
  const [type, setType] = useState(null);
  const [parent, setParent] = useState(null);
  const [subName, setSubName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryType = useCallback(async () => {
    if (!api || !address || !api.query.identity) {
      return;
    }

    let _type = "none";
    let _parent = null;
    let _subName = null;
    setIsLoading(true);
    try {
      const identityOf = await api.query.identity?.identityOf(address);
      if (identityOf?.isSome) {
        _type = "direct";
      } else {
        const superOf = await api.query.identity?.superOf(address);
        if (superOf?.isSome) {
          _type = "sub";
          const [mainAddr, name] = superOf.unwrap();
          _parent = mainAddr.toJSON();
          _subName = name.isRaw ? name.asRaw.toHuman() : null;
        }
      }
      setType(_type);
      setParent(_parent);
      setSubName(_subName);
    } catch (e) {
      console.error(e);
      setType(null);
    } finally {
      setIsLoading(false);
    }
  }, [api, address]);

  useEffect(() => {
    queryType();
  }, [queryType, address]);

  return { type, parent, subName, isLoading };
}

export default function useMyIdentityType() {
  const api = useContextApi();
  const address = useRealAddress();

  return useIdentityType(api, address);
}
