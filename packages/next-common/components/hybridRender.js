import { IS_SERVER } from "next-common/utils/constants";
import React, { useState, useEffect } from "react";

//solve the hydration problem on a side basis and it has not been cited for the time being
export default function HybridRender({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return <div key={isMounted ? "client" : "server"}>{children}</div>;
}

export function ClientOnly({ children, fallback = null }) {
  return IS_SERVER ? fallback : children;
}
