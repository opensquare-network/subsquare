import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import {
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";

export default function useMemberData() {
  const corePallet = useCoreFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();

  const address = useRealAddress();

  const [collectiveMember, setCollectiveMember] = useState();
  const { loading: isCollectiveMemberLoading } = useSubStorage(
    collectivePallet,
    "members",
    [address],
    useCallback((rawOptional) => setCollectiveMember(rawOptional.toJSON()), []),
  );

  const [coreMember, setCoreMember] = useState();
  const { loading: isCoreMemberLoading } = useSubStorage(
    corePallet,
    "member",
    [address],
    useCallback((rawOptional) => setCoreMember(rawOptional.toJSON()), []),
  );

  const [coreParams, setCoreParams] = useState();
  const { loading: isCoreParamsLoading } = useSubStorage(
    corePallet,
    "params",
    [],
    useCallback((rawOptional) => setCoreParams(rawOptional.toJSON()), []),
  );

  const isLoading =
    isCollectiveMemberLoading || isCoreMemberLoading || isCoreParamsLoading;

  if (isLoading) {
    return {
      data: null,
      isLoading: true,
    };
  }

  return {
    data: {
      collectiveMember,
      coreMember,
      coreParams,
    },
    isLoading,
  };
}
