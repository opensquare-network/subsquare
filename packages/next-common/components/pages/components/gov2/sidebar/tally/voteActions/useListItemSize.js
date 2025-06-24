import { useMemo } from "react";
import { isDirectVote } from "./common";

export function useDesktopItemSize(data) {
  return useMemo(() => {
    if (!data || !data?.length) {
      return null;
    }

    return (index) => {
      const item = data?.[index];
      if (!item) {
        return 72;
      }

      if (isDirectVote(item?.type)) {
        if (!item?.data?.preVote) {
          if (item?.data?.vote?.isSplitAbstain) {
            return 108;
          }

          return 88;
        }

        if (item?.data?.preVote) {
          if (
            item?.data?.preVote?.isSplitAbstain &&
            item?.data?.vote?.isSplitAbstain
          ) {
            return 108;
          }

          if (
            (item?.data?.preVote?.isStandard && item?.data?.vote?.isStandard) ||
            (item?.data?.preVote?.isSplit && item?.data?.vote?.isSplit)
          ) {
            return 88;
          }

          if (
            (item?.data?.preVote?.isStandard || item?.data?.vote?.isStandard) &&
            !item?.data?.preVote?.isSplitAbstain &&
            !item?.data?.vote?.isSplitAbstain
          ) {
            return 164;
          }

          return 184;
        }
      }

      return 72;
    };
  }, [data]);
}

// TODO
export function useMobileItemSize(data) {
  return useMemo(() => {
    if (!data || !data?.length) {
      return null;
    }

    return (index) => {
      const item = data?.[index];
      if (!item) {
        return 60;
      }

      return 400;
    };
  }, [data]);
}
