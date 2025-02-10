import { useUser } from "next-common/context/user";

export default function useRealAddress() {
  // return "15DCWHQknBjc5YPFoVj8Pn2KoqrqYywJJ95BYNYJ4Fj3NLqz";
  const user = useUser();
  return user?.proxyAddress || user?.address;
}
