import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";
import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VoteCallsList from "./voteCallsList";
import MobileVoteCallsList from "./mobile/voteCallsList";

export default function OpenGovCalls() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);
  const { width } = useWindowSize();

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

  return width > 1024 ? (
    <ListCard>
      <VoteCallsList data={data} isGov2={true} fetchData={fetchData} />
    </ListCard>
  ) : (
    <MobileVoteCallsList data={data} isGov2={true} fetchData={fetchData} />
  );
}
