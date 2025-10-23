import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useRouterAnchor() {
  const router = useRouter();
  const [anchor, setAnchor] = useState({
    hasAnchor: false,
    anchor: null,
  });

  useEffect(() => {
    if (window?.location?.hash === "") {
      return;
    }
    const anchor = window.location.hash.substring(1);
    setAnchor({
      hasAnchor: !!anchor,
      anchor: anchor || null,
    });
  }, [router]);

  return anchor;
}
