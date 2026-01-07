import { useWindowWidthContext } from "next-common/context/windowSize";
import { isNil } from "lodash-es";
import DesktopList from "./desktop";
import MobileList from "./mobile";

export default function ResponsiveReferendaVotes() {
  const width = useWindowWidthContext();
  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? <DesktopList /> : <MobileList />;
}
