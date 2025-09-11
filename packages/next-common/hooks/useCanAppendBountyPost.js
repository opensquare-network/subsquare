import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { usePost } from "next-common/context/post";
import { isNil } from "lodash-es";

export default function useCanAppendBountyPost() {
  const address = useRealAddress();
  const { proposer, onchainData, refToPost } = usePost();
  const { extractedCurators } = onchainData;
  const postType = refToPost?.postType;

  const isCuratorOrSignatories = useMemo(() => {
    if (isNil(extractedCurators)) {
      return false;
    }

    return extractedCurators?.includes(address);
  }, [extractedCurators, address]);

  const isProposer = useMemo(() => {
    return isSameAddress(address, proposer);
  }, [address, proposer]);

  return useMemo(() => {
    if (!address || postType !== "bounty") {
      return false;
    }

    return isProposer || isCuratorOrSignatories;
  }, [isProposer, isCuratorOrSignatories, address, postType]);
}
