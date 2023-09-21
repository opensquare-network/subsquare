import { useUser } from "next-common/context/user";

export default function useIsProxySet() {
  const loginUser = useUser();
  if (!loginUser) return false;
  return !!loginUser.proxyAddress;
}
