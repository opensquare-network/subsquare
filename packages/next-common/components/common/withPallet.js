import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function WithPallet({ pallet, children }) {
  const api = useContextApi();
  const [hasPallet, setHasPallet] = useState(false);

  useEffect(() => {
    if (!api || !pallet) {
      return;
    }

    setHasPallet(api.query[pallet]);
  }, [api, pallet]);

  if (!hasPallet) {
    return null;
  }

  return children;
}
