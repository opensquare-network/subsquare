import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubCoreFellowshipEvidence(
  address,
  pallet = "fellowshipCore",
) {
  const api = useContextApi();
  const [wish, setWish] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setLoading(true);
    setEvidence("");
    setWish("");

    api.query[pallet]?.memberEvidence(address, (evidence) => {
      setLoading(false);
      const data = evidence?.toJSON();
      if (!data) {
        return;
      }
      const [wish, text] = data;
      setWish(wish);
      setEvidence(text);
    });
  }, [api, address, pallet]);

  return {
    wish,
    evidence,
    loading,
  };
}
