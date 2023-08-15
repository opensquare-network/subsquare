import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VoteCallsList from "./voteCallsList";
import MobileVoteCallsList from "./mobile/voteCallsList";
import isNil from "lodash.isnil";
import { useIsReferenda } from "./common";

export default function ResponsiveCalls() {
  const { id } = usePageProps();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();
  const isReferenda = useIsReferenda();

  const fetchData = useCallback(
    (page, pageSize) => {
      setPage(page);

      setIsLoading(true);
      nextApi
        .fetch(
          `users/${id}/${isReferenda ? "referenda" : "democracy"}/vote-calls`,
          {
            page,
            pageSize,
            includesTitle: 1,
          },
        )
        .then(({ result }) => {
          if (result) {
            setData(result);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [id, isReferenda],
  );

  useEffect(() => {
    fetchData(1, 25);
  }, [fetchData]);

  if (isNil(width)) {
    return null;
  }

  return width > 1024 ? (
    <ListCard>
      <VoteCallsList
        data={data}
        isLoading={isLoading}
        fetchData={fetchData}
        page={page}
      />
    </ListCard>
  ) : (
    <MobileVoteCallsList
      data={data}
      isLoading={isLoading}
      fetchData={fetchData}
      page={page}
    />
  );
}
