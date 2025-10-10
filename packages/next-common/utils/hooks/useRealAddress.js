import { useUser } from "next-common/context/user";

export default function useRealAddress() {
  const user = useUser();
  // return "FFFF3gBSSDFSvK2HBq4qgLH75DHqXWPHeCnR1BSksAMacBs";
  return user?.proxyAddress || user?.address;
}
