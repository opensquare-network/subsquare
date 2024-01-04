import { useUser } from "next-common/context/user";

export default function useIsProxySet() {
  const user = useUser();
  if (!user) return false;
  return !!user.proxyAddress;
}
