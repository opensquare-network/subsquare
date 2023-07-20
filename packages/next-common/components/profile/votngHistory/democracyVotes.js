import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { ListCard } from "./styled";
import VoteDetailPopup from "./voteDetailPopup";
import VotesList from "./votesList";
import MobileVotesList from "./mobile/votesList";
import { normalizeVote } from "./common/normalizedVote";
import { useChain } from "next-common/context/chain";

export default function DemocracyVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();
  const [showVoteDetail, setShowVoteDetail] = useState(null);
  const chain = useChain();

  const fetchData = useCallback(
    (page, pageSize) => {
      setPage(page);

      setIsLoading(true);
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
            isGov2={false}
            fetchData={fetchData}
            setShowVoteDetail={setShowVoteDetail}
            page={page}
          />
        </ListCard>
      ) : (
        <MobileVotesList
          data={data}
          isLoading={isLoading}
          isGov2={false}
          fetchData={fetchData}
          setShowVoteDetail={setShowVoteDetail}
          page={page}
        />
      )}
      {showVoteDetail !== null && (
        <VoteDetailPopup
          isGov2={false}
          vote={normalizeVote(showVoteDetail, chain)}
          setShowVoteDetail={setShowVoteDetail}
        />
      )}
    </>
  );
}
