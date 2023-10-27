import { useEffect, useState } from "react";
import useApi from "./useApi";

export default function useCurrentBlockHeightAndTime() {
  const [data, setData] = useState([]);
  const api = useApi();

  useEffect(() => {
    if (!api) {
      return;
    }
    Promise.all([api.query.system.number(), api.query.timestamp.now()]).then(
      ([currentHeight, currentTimestamp]) => {
        setData([currentHeight, currentTimestamp]);
      },
    );
  }, [api]);

  return data;
}
