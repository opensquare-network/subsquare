import queryCoretimeCurrentSale from "next-common/services/gql/coretime/currentSale";
import { useAsync } from "react-use";
import { useState } from "react";

export default function useCoretimeCurrentSale() {
  const [loading, setLoading] = useState(true);

  const { value } = useAsync(async () => {
    setLoading(true);

    try {
      const result = await queryCoretimeCurrentSale();

      return result;
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    value,
    loading,
  };
}
