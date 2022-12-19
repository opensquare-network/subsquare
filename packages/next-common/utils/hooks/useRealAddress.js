import { useUser } from "next-common/context/user";

export default function useRealAddress() {
  const loginUser = useUser();
  return loginUser?.proxyAddress || loginUser?.address;
}
