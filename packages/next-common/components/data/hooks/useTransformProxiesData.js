import { useEffect, useState } from "react";

export default function useTransformProxiesData(data) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!data) {
      return;
    }

    const transformedData = Object.values(
      data.reduce((acc, { delegator, delegatee, proxyType, delay }) => {
        if (!acc[delegator]) {
          acc[delegator] = { delegator, items: [] };
        }

        acc[delegator].items.push({
          delegatee,
          proxyType,
          delay,
        });

        return acc;
      }, {}),
    );

    setResult(transformedData);
    setLoading(false);
  }, [data]);

  return { result, loading };
}
