import { useUser } from "next-common/context/user";

export default function useRealAddress() {
  const user = useUser();
  return user?.proxyAddress || user?.address;
}
