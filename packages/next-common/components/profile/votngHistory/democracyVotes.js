import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";
import DemocracyVotesList from "./democracyVotesList";

export default function DemocracyVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);

  const fetchData = useCallback(
    (page, pageSize) => {
      nextApi
        .fetch(`users/${id}/democracy/votes`, {
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

  return <DemocracyVotesList data={data} fetchData={fetchData} />;
}
