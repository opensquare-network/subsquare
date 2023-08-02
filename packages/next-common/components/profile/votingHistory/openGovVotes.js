import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VoteDetailPopup from "./voteDetailPopup";
import VotesList from "./votesList";
import MobileVotesList from "./mobile/votesList";

export default function OpenGovVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();
  const [showVoteDetail, setShowVoteDetail] = useState(null);

  const fetchData = useCallback(
    (page, pageSize) => {
      setPage(page);

      setIsLoading(true);
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
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [id],
  );

  useEffect(() => {
    fetchData(1, 25);
  }, [fetchData]);

  return (
    <>
      {width > 1024 ? (
        <ListCard>
          <VotesList
            data={data}
            isLoading={isLoading}
            isGov2={true}
            fetchData={fetchData}
            setShowVoteDetail={setShowVoteDetail}
            page={page}
          />
        </ListCard>
      ) : (
        <MobileVotesList
          data={data}
          isLoading={isLoading}
          isGov2={true}
          fetchData={fetchData}
          setShowVoteDetail={setShowVoteDetail}
          page={page}
        />
      )}
      {showVoteDetail !== null && (
        <VoteDetailPopup
          isGov2={true}
          vote={showVoteDetail}
          setShowVoteDetail={setShowVoteDetail}
        />
      )}
    </>
  );
}
