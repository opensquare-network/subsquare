import { isNil } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import MobileFellowshipVotesList from "./mobileFellowshipVotesList";
import FellowshipVotesList from "next-common/components/profile/votingHistory/fellowshipVotesList";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import {
  ModuleTabContext,
  Fellowship,
} from "next-common/components/profile/votingHistory/common";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";

export default function FellowshipMemberVotes({ address }) {
  const [data, setData] = useState();
  const { page, component: paginationComponent } = usePaginationComponent(
    data?.total || 0,
    data?.pageSize || 25,
  );
  const { width } = useWindowSize();
  const section = useCollectivesSection();

  const fetchData = useCallback(
    (page, pageSize) => {
      const query = {
        page,
        pageSize,
        includesTitle: 1,
      };

      nextApi
        .fetch(`users/${address}/${section}/votes`, query)
        .then(({ result }) => {
          if (result) {
            setData(result);
          }
        });
    },
    [address, section],
  );

  useEffect(() => {
    fetchData(page, 25);
  }, [fetchData, page]);

  if (isNil(width)) {
    return null;
  }

  return (
    <ModuleTabContext.Provider value={{ selectedTabId: Fellowship }}>
      {width > 1024 ? (
        <FellowshipVotesList data={data} />
      ) : (
        <MobileFellowshipVotesList data={data} />
      )}
      {paginationComponent}
    </ModuleTabContext.Provider>
  );
}
