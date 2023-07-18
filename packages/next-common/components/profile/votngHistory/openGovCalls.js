import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";
import OpenGovCallsList from "./openGovCallsList";

export default function OpenGovCalls() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);

  const fetchData = useCallback(
    (page, pageSize) => {
      nextApi
        .fetch(`users/${id}/referenda/vote-calls`, {
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

  return <OpenGovCallsList data={data} fetchData={fetchData} />;
}
