import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useCurrentBlockHeightAndTime() {
  const [data, setData] = useState([]);
  const api = useContextApi();

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
