import { useEffect } from "react";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Vote from "components/referenda/vote";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import useMaybeFetchElectorate from "next-common/utils/hooks/referenda/useMaybeFetchElectorate";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/democracy/referendum/checkUnFinalized";
import DemocracyReferendaDetail from "next-common/components/detail/Democracy/referendum";
import DetailLayout from "next-common/components/layout/DetailLayout";
import useDemocracyVotesFromServer from "next-common/utils/hooks/referenda/useDemocracyVotesFromServer";
import { clearVotes } from "next-common/store/reducers/democracy/votes";
import { useDispatch } from "react-redux";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import useSubDemocracyReferendumStatus from "next-common/hooks/democracy/useSubDemocracyReferendumStatus";
import useSetReferendumStatus from "next-common/hooks/democracy/useSetReferendumStatus";
import { useContextApi } from "next-common/context/api";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import DemocracyReferendaDetailMultiTabs from "components/tabs/democracyReferendaDetailMultiTabs";

function ReferendumContent() {
  const post = usePost();
  const api = useContextApi();
  const dispatch = useDispatch();

  useSubscribePostDetail(post?.referendumIndex);
  useSetReferendumStatus();
  useSubDemocracyReferendumStatus(post?.referendumIndex);

  useMaybeFetchElectorate(post?.onchainData, api);
  useDemocracyVotesFromServer(post.referendumIndex);
  useFetchVotes(post?.onchainData);

  useEffect(() => {
    return () => {
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <DemocracyReferendaDetail />
        <Vote referendumIndex={post?.referendumIndex} />
        <DemocracyReferendaDetailMultiTabs />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}

function ReferendumContentContentWithNullGuard() {
  const detail = usePost();
  const { id } = usePageProps();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return <ReferendumContent />;
}

function DemocracyReferendumPageImpl() {
  const detail = usePost();

  const desc = getMetaDesc(detail);

  const seoInfo = {
    title: detail?.title,
    desc,
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <DetailLayout seoInfo={seoInfo} hasSidebar>
      <ReferendumContentContentWithNullGuard />
    </DetailLayout>
  );
}

export default function DemocracyReferendumPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <DemocracyReferendumPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(`democracy/referendums/${id}`);
  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `democracy/referendums/${detail?._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
    },
  };
});
