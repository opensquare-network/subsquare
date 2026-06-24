import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

export default function DelayLoaderContent({ children, delay = 100 }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);

  return isLoaded ? children : <Skeleton className="w-48 h-4" />;
}
