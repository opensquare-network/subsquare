import { useState, useMemo } from "react";
import InfluenceDesktopList from "./desktopList";
import InfluenceMobileList from "./mobileList";
import { groupBy } from "lodash-es";
import Pagination from "next-common/components/pagination";
import {
  useFilteredDvReferenda,
  useFilteredDvVotes,
} from "next-common/context/referenda/dv";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

const InfluencePageSize = 10;

export default function InfluenceImpl() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const filteredReferenda = useFilteredDvReferenda();
  const votes = useFilteredDvVotes();

  const pageFilteredReferenda = useMemo(() => {
    const start = (page - 1) * InfluencePageSize;
    return filteredReferenda.slice(start, start + InfluencePageSize);
  }, [filteredReferenda, page]);

  const delegateReferendumVotesMap = useMemo(() => {
    return groupBy(votes, "referendumIndex");
  }, [votes]);

  let Component = InfluenceDesktopList;

  if (isMobile) {
    Component = InfluenceMobileList;
  }

  return (
    <>
      <Component
        list={pageFilteredReferenda}
        delegateReferendumVotesMap={delegateReferendumVotesMap}
      />

      <Pagination
        page={page}
        onPageChange={(e, val) => {
          e.preventDefault();
          setPage(val);
        }}
        shallow
        total={filteredReferenda.length}
        pageSize={InfluencePageSize}
      />
    </>
  );
}
