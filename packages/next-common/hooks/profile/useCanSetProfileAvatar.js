import { useMemo, useState, useEffect } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { isSameAddress } from "next-common/utils";
import { useContextApi } from "next-common/context/api";

export default function useCanSetProfileAvatar() {
  const profileAddress = useProfileAddress();
  const realAddress = useRealAddress();
  const api = useContextApi();

  const isSelf = useMemo(
    () => isSameAddress(realAddress, profileAddress),
    [realAddress, profileAddress],
  );

  const [isProxyAccount, setIsProxyAccount] = useState(false);

  useEffect(() => {
    if (
      isSelf ||
      !api ||
      !api?.query?.proxy?.proxies ||
      !realAddress ||
      !profileAddress
    ) {
      setIsProxyAccount(false);
      return;
    }

    api?.query?.proxy
      ?.proxies(profileAddress)
      .then((result) => {
        const data = result?.toJSON?.() || [];
        const isProxy = data[0]?.some(({ delegate }) =>
          isSameAddress(realAddress, delegate),
        );

        setIsProxyAccount(isProxy);
      })
      .catch(() => {
        setIsProxyAccount(false);
      });
  }, [api, realAddress, profileAddress, isSelf]);

  return useMemo(() => {
    if (!realAddress || !profileAddress) {
      return false;
    }

    if (isSelf) {
      return true;
    }

    return isProxyAccount;
  }, [realAddress, profileAddress, isSelf, isProxyAccount]);
}
