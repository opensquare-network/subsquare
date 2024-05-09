import FieldLoading from "next-common/components/icons/fieldLoading";
import FellowshipMemberInfoWrapper from "./infoWrapper";
import FellowshipMemberInfoTitle from "./title";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

function useFellowshipCoreMemberEvidence(address) {
  const api = useContextApi();
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setLoading(true);
    setEvidence(null);

    api.query.fellowshipCore
      ?.memberEvidence(address)
      .then((evidence) => {
        const data = evidence?.toJSON();
        if (!data) {
          return;
        }
        const [, text] = data;
        setEvidence(text);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, address]);

  return {
    evidence,
    loading,
  };
}

export default function FellowshipCoreMemberEvidence({ address }) {
  const { loading, evidence } = useFellowshipCoreMemberEvidence(address);
  return (
    <FellowshipMemberInfoWrapper>
      <FellowshipMemberInfoTitle>Evidence</FellowshipMemberInfoTitle>
      <div className="flex text12Medium break-all">
        {loading ? (
          <FieldLoading size={16} />
        ) : evidence ? (
          <span className="text-textSecondary">{evidence}</span>
        ) : (
          <span className="text-textTertiary">-</span>
        )}
      </div>
    </FellowshipMemberInfoWrapper>
  );
}
