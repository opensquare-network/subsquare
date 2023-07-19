import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";
import DemocracyVotesList from "./democracyVotesList";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import MobileDemocracyVotesList from "./mobile/democracyVotesList";
import { ListCard } from "./styled";
import VoteDetailPopup from "./voteDetailPopup";

export default function DemocracyVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState(EmptyList);
  const { width } = useWindowSize();
  const [showVoteDetail, setShowVoteDetail] = useState(null);

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

  return (
    <>
      {width > 1024 ? (
        <ListCard>
          <DemocracyVotesList
            data={data}
            fetchData={fetchData}
            setShowVoteDetail={setShowVoteDetail}
          />
        </ListCard>
      ) : (
        <MobileDemocracyVotesList
          data={data}
          fetchData={fetchData}
          setShowVoteDetail={setShowVoteDetail}
        />
      )}
      {showVoteDetail !== null && (
        <VoteDetailPopup
          vote={showVoteDetail}
          setShowVoteDetail={setShowVoteDetail}
        />
      )}
    </>
  );
}
