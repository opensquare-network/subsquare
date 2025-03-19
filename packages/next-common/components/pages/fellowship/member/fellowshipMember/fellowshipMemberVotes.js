import { isNil } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import MobileFellowshipVotesList from "./mobileFellowshipVotesList";
import FellowshipVotesList from "next-common/components/profile/votingHistory/fellowshipVotesList";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import {
  ModuleTabContext,
  Fellowship,
} from "next-common/components/profile/votingHistory/common";

const VoteDetailPopup = dynamicPopup(() =>
  import("next-common/components/profile/votingHistory/voteDetailPopup"),
);

export default function FellowshipMemberVotes({ address }) {
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowSize();
  const [showVoteDetail, setShowVoteDetail] = useState(null);
  const section = useCollectivesSection();
  const [voteFilter] = useCommittedFilterState();
  const { type: voteType } = voteFilter || {};

  const fetchData = useCallback(
    (page, pageSize) => {
      setPage(page);

      setIsLoading(true);

      const query = {
        page,
        pageSize,
        includesTitle: 1,
      };

      if (voteType) {
        query.type = voteType;
      }

      nextApi
        .fetch(`users/${address}/${section}/votes`, query)
        .then(({ result }) => {
          if (result) {
            setData(result);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [address, section, voteType],
  );

  useEffect(() => {
    fetchData(1, 25);
  }, [fetchData]);

  if (isNil(width)) {
    return null;
  }

  return (
    <>
      <ModuleTabContext.Provider value={{ selectedTabId: Fellowship }}>
        {width > 1024 ? (
          <FellowshipVotesList
            data={data}
            isLoading={isLoading}
            fetchData={fetchData}
            setShowVoteDetail={setShowVoteDetail}
            page={page}
          />
        ) : (
          <MobileFellowshipVotesList
            data={data}
            isLoading={isLoading}
            fetchData={fetchData}
            setShowVoteDetail={setShowVoteDetail}
            page={page}
          />
        )}
      </ModuleTabContext.Provider>

      {showVoteDetail !== null && (
        <VoteDetailPopup
          vote={showVoteDetail}
          setShowVoteDetail={setShowVoteDetail}
        />
      )}
    </>
  );
}
