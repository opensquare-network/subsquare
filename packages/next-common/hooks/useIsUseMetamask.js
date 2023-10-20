import isUseMetamask from "next-common/utils/isUseMetamask";
import { useEffect, useState } from "react";

export default function useIsUseMetamask() {
  const [isMetamask, setIsMetamask] = useState(false);

  useEffect(() => {
    setIsMetamask(isUseMetamask());
  });

  return isMetamask;
}
