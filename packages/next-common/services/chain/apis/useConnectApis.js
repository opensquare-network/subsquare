import { useChain } from "next-common/context/chain";
import { useEffect } from "react";
import newApi from "next-common/services/chain/apis/new";
import useCandidateNodes from "next-common/services/chain/apis/useCandidateNodes";

export default function useConnectApis() {
  const chain = useChain();
  const candidateNodes = useCandidateNodes();

  useEffect(() => {
    for (const endpoint of candidateNodes) {
      newApi(chain, endpoint);
    }
  }, [chain, candidateNodes]);
}
