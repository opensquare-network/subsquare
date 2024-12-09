import { useUser } from "next-common/context/user";

export default function useRealAddress() {
  const user = useUser();
  // return "12CJw9KNkC7FzVVg3dvny4PWHjjkvdyM17mmNfXyfucp8JfM";
  return user?.proxyAddress || user?.address;
}
