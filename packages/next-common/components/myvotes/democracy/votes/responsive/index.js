import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { isNil } from "lodash-es";
import DesktopList from "./desktop";
import MobileList from "./mobile";

export default function ResponsiveDemocracyVotes() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? <DesktopList /> : <MobileList />;
}
