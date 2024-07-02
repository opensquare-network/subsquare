import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isNil } from "lodash-es";

export default function useSimaCommentsAnchor() {
  const router = useRouter();
  const [anchor, setAnchor] = useState({
    hasAnchor: false,
    anchor: null,
  });

  useEffect(() => {
    if (window?.location?.hash === "") {
      return;
    }
    const cid = window.location.hash.substr(1);
    setAnchor({
      hasAnchor: !isNil(cid),
      anchor: cid || null,
    });
  }, [router]);

  return anchor;
}
