import { useEffect } from "react";
import getApiProvider from "next-common/services/chain/apis/providers";
import useCandidateNodes from "next-common/services/chain/apis/useCandidateNodes";

export default function useInitApiProviders() {
  const candidateNodes = useCandidateNodes();

  useEffect(() => {
    for (const endpoint of candidateNodes) {
      getApiProvider(endpoint);
    }
  }, [candidateNodes]);
}
