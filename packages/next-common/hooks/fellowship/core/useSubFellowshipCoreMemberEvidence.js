import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export function useSubFellowshipCoreMemberEvidence(address) {
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

    api.query.fellowshipCore?.memberEvidence(address, (evidence) => {
      setLoading(false);
      const data = evidence?.toJSON();
      if (!data) {
        return;
      }
      const [wish, text] = data;
      setWish(wish);
      setEvidence(text);
    });
  }, [api, address]);

  return {
    wish,
    evidence,
    loading,
  };
}
