import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useNextLaunchTimestamp() {
  const api = useApi();
  const [timestamp, setTimestamp] = useState();

  useEffect(() => {
    if (!api || !api?.query.democracy?.nextLaunchTimestamp) {
      return;
    }

    api.query.democracy.nextLaunchTimestamp().then((response) => {
      setTimestamp(response.toBigInt().toString());
    });
  }, [api]);

  return timestamp;
}
