import { useNavCollapsed } from "next-common/context/nav";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { MD_SIZE, SM_SIZE } from "next-common/utils/responsive";

export default function useIsNarrowView() {
  const width = useWindowWidthContext();
  const [navCollapsed] = useNavCollapsed();
  if (
    (navCollapsed && width <= SM_SIZE) ||
    (!navCollapsed && width <= MD_SIZE)
  ) {
    return true;
  }

  return false;
}
