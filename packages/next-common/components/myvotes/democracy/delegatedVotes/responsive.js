import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { isNil } from "lodash-es";
import DesktopList from "./desktopList";
import MobileList from "./mobileList";

export default function ResponsiveDelegatedVotesList() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? (
    <DesktopList /> // desktop view
  ) : (
    <MobileList /> // mobile view
  );
}
