import { useState, useMemo, useEffect } from "react";
import InfluenceDesktopList from "./desktopList";
import InfluenceMobileList from "./mobileList";
import InfluenceStatistic from "./statistic";
import { groupBy } from "lodash-es";
import Pagination from "next-common/components/pagination";
import {
  useFilteredDvReferenda,
  useFilteredDvVotes,
} from "next-common/context/referenda/dv";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { useRouter } from "next/router";

const InfluencePageSize = 10;

export default function InfluenceImpl() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const filteredReferenda = useFilteredDvReferenda();
  const votes = useFilteredDvVotes();
  const router = useRouter();

  useEffect(() => {
    setPage(parseInt(router.query.page || 1));
  }, [router.query.page]);

  const sortedReferenda = useMemo(() => {
    return filteredReferenda.sort(
      (a, b) => b.referendumIndex - a.referendumIndex,
    );
  }, [filteredReferenda]);

  const pageFilteredReferenda = useMemo(() => {
    const start = (page - 1) * InfluencePageSize;
    return sortedReferenda.slice(start, start + InfluencePageSize);
  }, [sortedReferenda, page]);

  const delegateReferendumVotesMap = useMemo(() => {
    return groupBy(votes, "referendumIndex");
  }, [votes]);

  let Component = InfluenceDesktopList;

  if (isMobile) {
    Component = InfluenceMobileList;
  }

  return (
    <>
      <InfluenceStatistic
        delegateReferendumVotesMap={delegateReferendumVotesMap}
      />
      <Component
        list={pageFilteredReferenda}
        delegateReferendumVotesMap={delegateReferendumVotesMap}
      />

      <Pagination
        page={page}
        onPageChange={(e, val) => {
          setPage(val);
          e.preventDefault();
          e.stopPropagation();
        }}
        shallow
        total={filteredReferenda.length}
        pageSize={InfluencePageSize}
      />
    </>
  );
}
