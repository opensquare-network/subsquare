import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { isSameAddress } from "next-common/utils";
import useProfileOnChainProxies from "next-common/components/profile/proxy/hooks/useProfileOnChainProxies";

export default function useCanSetProfileAvatar() {
  const profileAddress = useProfileAddress();
  const realAddress = useRealAddress();
  const { proxies = [], loading } = useProfileOnChainProxies(profileAddress);

  return useMemo(() => {
    if (!realAddress || !profileAddress || loading || !proxies[0]?.length) {
      return false;
    }

    const isSelf = isSameAddress(realAddress, profileAddress);

    if (isSelf) {
      return true;
    }

    const isProxyAccount = proxies[0].some(({ delegate }) =>
      isSameAddress(realAddress, delegate),
    );

    return isProxyAccount;
  }, [realAddress, profileAddress, proxies, loading]);
}
