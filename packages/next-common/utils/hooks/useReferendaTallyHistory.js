import nextApi from "next-common/services/nextApi";
import { useEffect, useState } from "react";

export default function useReferendaTallyHistory(referendumIndex) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    nextApi
      .fetch(`gov2/referenda/${referendumIndex}/tally-history`)
      .then(({ result }) => {
        if (!result) return;
        setData(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [referendumIndex]);

  return {
    isLoading,
    data,
  };
}
