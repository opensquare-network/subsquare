import { usePageProps } from "next-common/context/page";
import { getMainMenu } from "next-common/utils/consts/menu";
import { useUser } from "next-common/context/user";
import { useMemo } from "react";

export default function useMainMenuData() {
  const user = useUser();
  const { tracks, fellowshipTracks, summary, detail, ambassadorTracks } =
    usePageProps();
  const mainMenu = useMemo(() => {
    return getMainMenu({
      tracks,
      fellowshipTracks,
      ambassadorTracks,
      summary,
      currentTrackId: detail?.track,
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
  ]);

  return mainMenu;
}
