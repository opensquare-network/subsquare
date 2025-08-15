import useForeignAssets from "next-common/hooks/foreignAssets/useForeignAssets";

export default function useProfileForeignAssets(address) {
  const { assets, loading } = useForeignAssets(address);

  return { assets, loading };
}
