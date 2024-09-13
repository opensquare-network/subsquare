import { useUser } from "next-common/context/user";

export default function useRealAddress() {
  return "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk";
  const user = useUser();
  return user?.proxyAddress || user?.address;
}
