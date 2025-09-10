import { useState, useMemo } from "react";
import InfluenceDesktopList from "./desktopList";
import InfluenceMobileList from "./mobileList";
import { useAsync } from "react-use";
import { groupBy } from "lodash-es";
import { fetchReferendumData } from "next-common/services/referendaData";
import Pagination from "next-common/components/pagination";
import {
  useFilteredDvReferenda,
  useFilteredDvVotes,
} from "next-common/context/referenda/dv";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

const InfluencePageSize = 5;

export default function InfluenceImpl() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const filteredReferenda = useFilteredDvReferenda();
  const votes = useFilteredDvVotes();

  const pageFilteredReferenda = useMemo(() => {
    const start = (page - 1) * InfluencePageSize;
    return filteredReferenda.slice(start, start + InfluencePageSize);
  }, [filteredReferenda, page]);

  const { loading, value: referendumData } = useAsync(async () => {
    return Promise.all(
      pageFilteredReferenda.map((referendum) =>
        fetchReferendumData(referendum.referendumIndex),
      ),
    );
  }, [pageFilteredReferenda]);

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
        loading={loading}
        referendumData={referendumData}
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
