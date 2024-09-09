import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useMemberData(section = "fellowship") {
  let corePallet;
  let collectivePallet;

  if (section === "fellowship") {
    corePallet = "fellowshipCore";
    collectivePallet = "fellowshipCollective";
  } else if (section === "ambassador") {
    corePallet = "ambassadorCore";
    collectivePallet = "ambassadorCollective";
  }

  const address = useRealAddress();

  const [collectiveMember, setCollectiveMember] = useState();
  const { loading: isCollectiveMemberLoading } = useSubStorage(
    collectivePallet,
    "members",
    [address],
    {
      callback: useCallback((rawOptional) => {
        setCollectiveMember(rawOptional.toJSON());
      }, []),
    },
  );

  const [coreMember, setCoreMember] = useState();
  const { loading: isCoreMemberLoading } = useSubStorage(
    corePallet,
    "member",
    [address],
    {
      callback: useCallback((rawOptional) => {
        setCoreMember(rawOptional.toJSON());
      }, []),
    },
  );

  const [coreParams, setCoreParams] = useState();
  const { loading: isCoreParamsLoading } = useSubStorage(
    corePallet,
    "params",
    [],
    {
      callback: useCallback((rawOptional) => {
        setCoreParams(rawOptional.toJSON());
      }, []),
    },
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
