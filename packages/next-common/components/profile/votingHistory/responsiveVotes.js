import { useCallback, useEffect, useState } from "react";
import { backendApi } from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { ListCard } from "./styled";
import { useWindowWidthContext } from "next-common/context/windowSize";
import VotesList from "./votesList";
import MobileFellowshipVotesList from "./mobile/fellowshipVotesList";
import { isNil } from "lodash-es";
import { useIsFellowship, useModuleName } from "./common";
import FellowshipVotesList from "./fellowshipVotesList";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";

const VoteDetailPopup = dynamicPopup(() => import("./voteDetailPopup"));

export default function ResponsiveVotes() {
  const { id } = usePageProps();
  const [data, setData] = useState();
  const { page, component: paginationComponent } = usePaginationComponent(
    data?.total || 0,
    data?.pageSize || 25,
  );
  const width = useWindowWidthContext();
  const [showVoteDetail, setShowVoteDetail] = useState(null);
  const moduleName = useModuleName();
  const isFellowship = useIsFellowship();
  const [voteFilter] = useCommittedFilterState();
  const { type: voteType } = voteFilter || {};

  useEffect(() => {
    setData();
  }, [moduleName]);

  const fetchData = useCallback(
    (page, pageSize) => {
      const query = {
        page,
        pageSize,
        includesTitle: 1,
      };

      if (voteType) {
        query.type = voteType;
      }

      backendApi
        .fetch(`users/${id}/${moduleName}/votes`, query)
        .then(({ result }) => {
          if (result) {
            setData(result);
          }
        });
    },
    [id, moduleName, voteType],
  );

  useEffect(() => {
    fetchData(page, 25);
  }, [fetchData, page]);

  if (isNil(width)) {
    return null;
  }

  const VotesListComponent = isFellowship ? FellowshipVotesList : VotesList;

  let listContent = (
    <ListCard>
      <VotesListComponent data={data} setShowVoteDetail={setShowVoteDetail} />
      {paginationComponent}
    </ListCard>
  );

  if (isFellowship && width <= 1024) {
    listContent = (
      <>
        <MobileFellowshipVotesList data={data} />
        {paginationComponent}
      </>
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
