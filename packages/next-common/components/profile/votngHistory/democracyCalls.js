import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";
import DemocracyCallsList from "./democracyCallsList";

export default function DemocracyCalls() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);

  const fetchData = useCallback(
    (page, pageSize) => {
      nextApi
        .fetch(`users/${id}/democracy/vote-calls`, {
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

  return <DemocracyCallsList data={data} fetchData={fetchData} />;
}
