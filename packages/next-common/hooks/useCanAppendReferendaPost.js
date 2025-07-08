import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { usePost } from "next-common/context/post";

export default function useCanAppendReferendaPost() {
  const address = useRealAddress();
  const { authors, refToPost } = usePost();
  const postType = refToPost?.postType;

  return useMemo(() => {
    if (
      !address ||
      !authors ||
      authors?.length === 0 ||
      postType !== "referendaReferendum"
    ) {
      return false;
    }

    return authors?.includes(address);
  }, [address, authors, postType]);
}
