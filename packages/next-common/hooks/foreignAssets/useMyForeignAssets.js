import useForeignAssets from "./useForeignAssets";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useMyForeignAssets() {
  const realAddress = useRealAddress();
  const { assets, loading } = useForeignAssets(realAddress);

  return { assets, loading };
}
