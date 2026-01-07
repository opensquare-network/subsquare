import { useUser } from "next-common/context/user";

export default function useRealAddress() {
  return "15BWkPmv1fJkDZEFVZyNZa97ugTxcR61WRNSkTeA5M2xN1DP";
  const user = useUser();
  return user?.proxyAddress || user?.address;
}
