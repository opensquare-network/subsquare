import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useCommentsAnchor() {
  const router = useRouter();
  const [anchor, setAnchor] = useState({
    hasAnchor: false,
    anchor: null,
  });

  useEffect(() => {
    if (window?.location?.hash === "") {
      return;
    }
    const height = parseInt(window.location.hash.substr(1));
    setAnchor({
      hasAnchor: !isNaN(height),
      anchor: height || null,
    });
  }, [router]);

  return anchor;
}
