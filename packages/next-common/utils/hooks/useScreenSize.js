import { useEffect, useState } from "react";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { SM_SIZE, MD_SIZE } from "../../utils/responsive";

export function useScreenSize() {
  const width = useWindowWidthContext();
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(false);
  const [lg, setLg] = useState(false);

  useEffect(() => {
    setSm(width <= SM_SIZE);
    setMd(width <= MD_SIZE);
    setLg(width > MD_SIZE);
  }, [width]);

  return {
    sm,
    md,
    lg,
  };
}
