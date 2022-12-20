import { useMemo } from "react";
import useWindowSize from "./useWindowSize";
import { SM_SIZE, MD_SIZE } from "../../utils/responsive";

export function useScreenSize() {
  const { width } = useWindowSize();

  const size = useMemo(() => {
    let sm = false,
      md = false,
      lg = false;

    if (width <= SM_SIZE) {
      sm = true;
    } else if (width <= MD_SIZE) {
      md = true;
    } else {
      lg = true;
    }

    return {
      sm,
      md,
      lg,
    };
  }, [width]);

  return size;
}
