import { LG_SIZE, MD_SIZE, SM_SIZE } from "../responsive";
import useWindowSize from "./useWindowSize";

export function useIsScreenSize() {
  const { width } = useWindowSize();

  return {
    isSmSize: width <= SM_SIZE,
    isMdSize: width <= MD_SIZE,
    isLgSize: width <= LG_SIZE,
  };
}
