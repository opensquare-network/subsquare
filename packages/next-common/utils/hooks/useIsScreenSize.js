import { LG_SIZE, MD_SIZE, SM_SIZE } from "../responsive";
import { useWindowWidthContext } from "next-common/context/windowSize";

export function useIsScreenSize() {
  const width = useWindowWidthContext();

  return {
    isSmSize: width <= SM_SIZE,
    isMdSize: width <= MD_SIZE,
    isLgSize: width <= LG_SIZE,
  };
}
