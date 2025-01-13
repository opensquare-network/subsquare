import { useNavCollapsed } from "next-common/context/nav";
import { useWindowSize } from "react-use";
import { MD_SIZE, SM_SIZE } from "next-common/utils/responsive";

export default function useIsNarrowView() {
  const { width } = useWindowSize();
  const [navCollapsed] = useNavCollapsed();
  if (
    (navCollapsed && width <= SM_SIZE) ||
    (!navCollapsed && width <= MD_SIZE)
  ) {
    return true;
  }

  return false;
}
