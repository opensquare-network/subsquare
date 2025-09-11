import { useWindowWidthContext } from "next-common/context/windowSize";
import { useNavCollapsed } from "next-common/context/nav";

export default function usePopupItemHeight() {
  const width = useWindowWidthContext();
  const [navCollapsed] = useNavCollapsed();

  if (navCollapsed) {
    return width > 768 ? 52 : 112;
  }

  return width > 1024 ? 52 : 112;
}
