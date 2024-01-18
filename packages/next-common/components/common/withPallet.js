import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function WithPallet({ pallet, children }) {
  const api = useApi();
  const [hasPallet, setHasPallet] = useState(false);

  useEffect(() => {
    if (!api || !pallet) {
      return;
    }

    setHasPallet(api.query[pallet]);
  }, [api]);

  if (!hasPallet) {
    return null;
  }

  return children;
}
