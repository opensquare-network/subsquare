import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useHasTips() {
  const api = useApi();
  const [has, setHas] = useState(false);

  useEffect(() => {
    if (api && api.query?.tips) {
      setHas(true);
    }
  }, [api]);

  return has;
}
