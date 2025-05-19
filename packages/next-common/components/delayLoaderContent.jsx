import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

export default function DelayLoaderContent({ children, delay = 200 }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, delay);
  }, [delay]);

  return isLoaded ? children : <Skeleton className="w-48 h-4" />;
}
