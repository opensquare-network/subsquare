import { usePageProps } from "next-common/context/page";
import { getMainMenu } from "next-common/utils/consts/menu";
import { useUser } from "next-common/context/user";
import { useMemo } from "react";
import useIsAdmin from "./useIsAdmin";
import useHasActiveJudgementRequest from "next-common/components/people/hooks/useHasActiveJudgementRequest";

export default function useMainMenuData() {
  const user = useUser();
  const { tracks, fellowshipTracks, summary, detail, ambassadorTracks } =
    usePageProps();
  const hasActiveJudgementRequest = useHasActiveJudgementRequest();

  const isAdmin = useIsAdmin();

  return useMemo(() => {
    return getMainMenu({
      tracks,
      fellowshipTracks,
      ambassadorTracks,
      summary,
      currentTrackId: detail?.track,
      isAdmin,
      hasActiveJudgementRequest,
    }).filter((item) => {
      if (item.value === "account") {
        // not connect wallet
        return !!user?.address;
      }
      return true;
    });
  }, [
    ambassadorTracks,
    detail?.track,
    fellowshipTracks,
    summary,
    tracks,
    user?.address,
    isAdmin,
    hasActiveJudgementRequest,
  ]);
}
