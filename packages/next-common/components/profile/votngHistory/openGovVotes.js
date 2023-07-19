import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";
import { ListCard } from "./styled";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import VoteDetailPopup from "./voteDetailPopup";
import VotesList from "./votesList";
import MobileVotesList from "./mobile/votesList";

export default function OpenGovVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);
  const { width } = useWindowSize();
  const [showVoteDetail, setShowVoteDetail] = useState(null);

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

  return (
    <>
      {width > 1024 ? (
        <ListCard>
          <VotesList
            data={data}
            isGov2={true}
            fetchData={fetchData}
            setShowVoteDetail={setShowVoteDetail}
          />
        </ListCard>
      ) : (
        <MobileVotesList
          data={data}
          isGov2={true}
          fetchData={fetchData}
          setShowVoteDetail={setShowVoteDetail}
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
