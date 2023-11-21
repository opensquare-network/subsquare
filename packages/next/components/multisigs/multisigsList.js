import useWindowSize from "next-common/utils/hooks/useWindowSize";
import isNil from "lodash.isnil";
import DesktopList from "./desktop";

export default function MultisigsList() {
  const { width } = useWindowSize();

  // Fixme: MobileList is not implemented yet.
  const MobileList = DesktopList;

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? <DesktopList /> : <MobileList />;
}
