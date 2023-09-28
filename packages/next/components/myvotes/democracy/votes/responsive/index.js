import useWindowSize from "next-common/utils/hooks/useWindowSize";
import isNil from "lodash.isnil";
import DesktopList from "./desktop";
import { ListCard } from "../../../styled";
import ProxyHint from "../../../proxyHint";

export default function ResponsiveDemocracyVotes() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? (
    <ListCard>
      <ProxyHint style={{ marginBottom: 24 }} />
      <DesktopList />
    </ListCard>
  ) : null;
}
