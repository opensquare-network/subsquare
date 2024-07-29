import { merge } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import {
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
} from "next-common/context/collectives/collectives";
import useCall from "next-common/utils/hooks/useCall";
import { useMemo } from "react";

export default function useAllMemberData() {
  const api = useContextApi();
  const corePallet = useCoreFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();

  const { value: collectiveMembers, loading: isLoadingCollectiveMembers } =
    useCall(api?.query[collectivePallet]?.members?.entries, []);
  const { value: coreMembers, loading: isLoadingCoreMembers } = useCall(
    api?.query[corePallet]?.member?.entries,
    [],
  );
  const { value: coreParams, loading: isLoadingCoreParams } = useCall(
    api?.query[corePallet]?.params,
    [],
  );

  const isLoading =
    isLoadingCollectiveMembers || isLoadingCoreMembers || isLoadingCoreParams;

  return useMemo(() => {
    if (isLoading) {
      return {
        data: null,
        isLoading: true,
      };
    }

    const collectiveMemberData = Object.fromEntries(
      (collectiveMembers || []).map((collectiveMember) => {
        const address = collectiveMember[0].args[0].toJSON();
        const data = collectiveMember[1].toJSON();
        return [address, data];
      }),
    );
    const coreMemberData = Object.fromEntries(
      (coreMembers || []).map((coreMember) => {
        const address = coreMember[0].args[0].toJSON();
        const data = coreMember[1].toJSON();
        return [address, data];
      }),
    );
    const mergedData = merge(coreMemberData, collectiveMemberData);

    return {
      data: {
        data: mergedData,
        coreParams,
      },
      isLoading,
    };
  }, [collectiveMembers, coreMembers, coreParams, isLoading]);
}
