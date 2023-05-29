import nextApi from "next-common/services/nextApi";
import { useEffect, useState } from "react";

export default function useAchainableData(id) {
  const [data, setData] = useState();
  useEffect(() => {
    nextApi.fetch(`users/${id}/achainable-profile`).then(({ result }) => {
      setData(result);
    });
  }, [id]);

  return data;
}
