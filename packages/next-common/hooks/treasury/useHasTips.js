import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useHasTips() {
  const api = useContextApi();
  const [has, setHas] = useState(false);

  useEffect(() => {
    if (api && api.query?.tips) {
      setHas(true);
    }
  }, [api]);

  return has;
}
