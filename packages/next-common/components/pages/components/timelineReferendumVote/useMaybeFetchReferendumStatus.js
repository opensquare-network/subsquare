import { useEffect, useState } from "react";
import extractVoteInfo from "next-common/utils/democracy/referendum";
import { useContextApi } from "next-common/context/api";

export default function useMaybeFetchReferendumStatus(referendum) {
  const api = useContextApi();
  const { voteFinished } = extractVoteInfo(referendum?.timeline);
  const [referendumStatus, setReferendumStatus] = useState(
    referendum?.status || referendum?.info?.ongoing || referendum?.meta,
  );

  useEffect(() => {
    if (voteFinished) {
      return;
    }
    api?.query.democracy
      .referendumInfoOf(referendum?.referendumIndex)
      .then((referendumInfo) => {
        const data = referendumInfo?.toJSON();
        if (data?.ongoing) {
          setReferendumStatus(data?.ongoing);
        }
      });
  }, [api, referendum?.referendumIndex, voteFinished]);

  return referendumStatus;
}
