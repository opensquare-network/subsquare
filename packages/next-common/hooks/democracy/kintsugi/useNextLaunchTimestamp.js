import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useNextLaunchTimestamp() {
  const api = useContextApi();
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
