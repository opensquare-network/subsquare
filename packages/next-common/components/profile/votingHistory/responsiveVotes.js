import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VotesList from "./votesList";
import MobileFellowshipVotesList from "./mobile/fellowshipVotesList";
import { isNil } from "lodash-es";
import { useIsFellowship, useModuleName } from "./common";
import FellowshipVotesList from "./fellowshipVotesList";
import dynamicPopup from "next-common/lib/dynamic/popup";

const VoteDetailPopup = dynamicPopup(() => import("./voteDetailPopup"));

export default function ResponsiveVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();
  const [showVoteDetail, setShowVoteDetail] = useState(null);
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
        .fetch(`users/${id}/${module}/votes`, {
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

  const VotesListComponent = isFellowship ? FellowshipVotesList : VotesList;

  let listContent = (
    <ListCard>
      <VotesListComponent
        data={data}
        isLoading={isLoading}
        fetchData={fetchData}
        setShowVoteDetail={setShowVoteDetail}
        page={page}
      />
    </ListCard>
  );

  if (isFellowship) {
    listContent =
      width > 1024 ? (
        listContent
      ) : (
        <MobileFellowshipVotesList
          data={data}
          isLoading={isLoading}
          fetchData={fetchData}
          setShowVoteDetail={setShowVoteDetail}
          page={page}
        />
      );
  }

  return (
    <>
      {listContent}

      {showVoteDetail !== null && (
        <VoteDetailPopup
          vote={showVoteDetail}
          setShowVoteDetail={setShowVoteDetail}
        />
      )}
    </>
  );
}
