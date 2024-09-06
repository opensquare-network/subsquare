import usePostTipMeta from "../../context/post/treasury/tip/tipMeta";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useTipMeta(tipHash) {
  const postTipMeta = usePostTipMeta();

  const { loading, result } = useSubStorage(
    "tips",
    "tips",
    [tipHash],
  );

  const tipMeta = result?.toJSON() || postTipMeta;
  return {
    isLoading: loading,
    tipMeta,
  }
}
