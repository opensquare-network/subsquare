import ProxyHint from "../../../proxyHint";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import businessCategory from "next-common/utils/consts/business/category";
import {
  getReferendumPostTitleColumn,
  getStatusTagColumn,
  getTrackColumn,
  getVoteSummaryColumn,
} from "next-common/components/overview/recentProposals/columns";
import { useAsync } from "react-use";
import normalizeGov2ReferendaListItem from "next-common/utils/gov2/list/normalizeReferendaListItem";
import { usePageProps } from "next-common/context/page";
import {
  ActiveReferendaProvider,
  useActiveReferendaContext,
} from "next-common/context/activeReferenda";
import useFetchMyReferendaVoting from "../../useFetchMyReferendaVoting";
import {
  isLoadingReferendaVotingSelector,
  myReferendaVotingSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { useSelector } from "react-redux";
import { flatten } from "lodash-es";
import { useMemo } from "react";
import { getOpenGovReferendaPosts } from "next-common/utils/posts";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";

function useMyVotedReferenda() {
  useFetchMyReferendaVoting();
  const voting = useSelector(myReferendaVotingSelector);
  const isLoading = useSelector(isLoadingReferendaVotingSelector);
  const myVotedReferenda = useMemo(() => {
    return flatten(
      voting.map((item) =>
        (item.votes || []).map((vote) => vote.referendumIndex),
      ),
    );
  }, [voting]);
  return {
    myVotedReferenda,
    isLoading,
  };
}

function useUnVotedActiveReferenda() {
  const { activeReferenda, isLoadingActiveReferenda } =
    useActiveReferendaContext();
  const { myVotedReferenda, isLoading: isLoadingMyVotedReferenda } =
    useMyVotedReferenda();

  const isLoading = isLoadingActiveReferenda || isLoadingMyVotedReferenda;

  const unVotedActiveReferenda = useMemo(() => {
    if (isLoading) {
      return;
    }
    const allActiveReferenda = activeReferenda.map(
      ({ referendumIndex }) => referendumIndex,
    );
    return allActiveReferenda.filter(
      (referendumIndex) => !myVotedReferenda.includes(referendumIndex),
    );
  }, [isLoading, myVotedReferenda, activeReferenda]);

  return {
    unVotedActiveReferenda,
    isLoading,
  };
}

function ActiveProposalsList() {
  const { tracks } = usePageProps();
  const { unVotedActiveReferenda, isLoading: isLoadingUnVotedActiveReferenda } =
    useUnVotedActiveReferenda();
  const { value: data, loading: isLoadingReferendaPosts } =
    useAsync(async () => {
      if (isLoadingUnVotedActiveReferenda) {
        return [];
      }
      const referenda = await getOpenGovReferendaPosts(unVotedActiveReferenda);
      return (referenda || []).map((item) =>
        normalizeGov2ReferendaListItem(item, tracks),
      );
    }, [tracks, unVotedActiveReferenda, isLoadingUnVotedActiveReferenda]);

  const isLoading = isLoadingReferendaPosts || isLoadingUnVotedActiveReferenda;

  const columns = [
    getReferendumPostTitleColumn(),
    getTrackColumn({ hrefPrefix: "/referenda/tracks" }),
    getVoteSummaryColumn({ type: businessCategory.openGovReferenda }),
    getStatusTagColumn({ category: businessCategory.openGovReferenda }),
  ];

  const { page, component: paginationComponent } = usePaginationComponent(
    data?.length || 0,
    10,
  );
  const pageItems = useMemo(
    () => (data || [])?.slice((page - 1) * 10, page * 10),
    [data, page],
  );

  return (
    <div>
      <ProxyHint style={{ marginBottom: 24 }} />
      <ScrollerX>
        <MapDataList
          loading={isLoading}
          columnsDef={columns}
          data={pageItems}
          noDataText="No current active proposals"
        />
      </ScrollerX>
      {paginationComponent}
    </div>
  );
}

export default function DesktopActiveProposalList() {
  return (
    <ActiveReferendaProvider pallet="referenda">
      <ActiveProposalsList />
    </ActiveReferendaProvider>
  );
}
