import { useEffect, useState } from "react";

export default function useIsLoaded(isLoading) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevIsLoading, setPrevIsLoading] = useState(isLoading);

  useEffect(() => {
    if (prevIsLoading && !isLoading) {
      setIsLoaded(true);
    }
    setPrevIsLoading(isLoading);
  }, [isLoading, prevIsLoading]);

  return isLoaded;
}
