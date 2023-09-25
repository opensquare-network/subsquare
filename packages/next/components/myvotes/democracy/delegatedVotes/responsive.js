import useWindowSize from "next-common/utils/hooks/useWindowSize";
import isNil from "lodash.isnil";
import DesktopList from "./desktopList";

export default function ResponsiveDelegatedVotesList() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? (
    <DesktopList /> // desktop view
  ) : null; // mobile view
}
