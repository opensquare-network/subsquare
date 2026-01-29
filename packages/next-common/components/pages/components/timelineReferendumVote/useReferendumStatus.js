import { useEffect, useState } from "react";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import { isNil } from "lodash-es";

export default function useReferendumStatus(referendum) {
  const api = useConditionalContextApi();
  const [referendumStatus, setReferendumStatus] = useState(
    referendum?.status || referendum?.info?.ongoing || referendum?.meta,
  );

  useEffect(() => {
    if (isNil(referendum?.referendumIndex)) {
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
  }, [api, referendum?.referendumIndex]);

  return referendumStatus;
}
