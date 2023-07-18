import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";
import OpenGovVotesList from "./openGovVotesList";

export default function OpenGovVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);

  const fetchData = useCallback(
    (page, pageSize) => {
      nextApi
        .fetch(`users/${id}/referenda/votes`, {
          page,
          pageSize,
          includesTitle: 1,
        })
        .then(({ result }) => {
          if (result) {
            setData(result);
          }
        });
    },
    [id],
  );

  useEffect(() => {
    fetchData(data?.page, data?.pageSize);
  }, [fetchData, data?.page, data?.pageSize]);

  return <OpenGovVotesList data={data} fetchData={fetchData} />;
}
