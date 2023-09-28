import useWindowSize from "next-common/utils/hooks/useWindowSize";
import isNil from "lodash.isnil";
import { ListCard } from "../../../styled";
import ProxyHint from "../../../proxyHint";
import DesktopList from "./desktop";
import MobileList from "./mobile";

export default function ResponsiveReferendaVotes() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? (
    <ListCard>
      <ProxyHint style={{ marginBottom: 24 }} />
      <DesktopList />
    </ListCard>
  ) : (
    <MobileList />
  );
}
