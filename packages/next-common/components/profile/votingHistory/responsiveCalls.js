import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VoteCallsList from "./voteCallsList";
import FellowshipVoteCallsList from "./fellowshipVoteCallsList";
import MobileVoteCallsList from "./mobile/voteCallsList";
import MobileFellowshipVoteCallsList from "./mobile/fellowshipVoteCallsList";
import isNil from "lodash.isnil";
import { useIsFellowship, useModuleName } from "./common";

export default function ResponsiveCalls() {
  const { id } = usePageProps();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();
  const module = useModuleName();
  const isFellowship = useIsFellowship();

  useEffect(() => {
    setData();
  }, [module]);

  const fetchData = useCallback(
    (page, pageSize) => {
      setPage(page);

      setIsLoading(true);
      nextApi
        .fetch(`users/${id}/${module}/vote-calls`, {
          page,
          pageSize,
          includesTitle: 1,
        })
        .then(({ result }) => {
          if (result) {
            setData(result);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [id, module],
  );

  useEffect(() => {
    fetchData(1, 25);
  }, [fetchData]);

  if (isNil(width)) {
    return null;
  }

  const VoteCallsListComponent = isFellowship
    ? FellowshipVoteCallsList
    : VoteCallsList;
  const MobileVoteCallsListComponent = isFellowship
    ? MobileFellowshipVoteCallsList
    : MobileVoteCallsList;

  return width > 1024 ? (
    <ListCard>
      <VoteCallsListComponent
        data={data}
        isLoading={isLoading}
        fetchData={fetchData}
        page={page}
      />
    </ListCard>
  ) : (
    <MobileVoteCallsListComponent
      data={data}
      isLoading={isLoading}
      fetchData={fetchData}
      page={page}
    />
  );
}
