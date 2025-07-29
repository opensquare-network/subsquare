import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import {
  fellowshipParamsApi,
  getFellowshipReferendumCommentsUrl,
  getFellowshipReferendumUrl,
  fellowshipTracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider, usePost } from "next-common/context/post";
import { getBannerUrl } from "next-common/utils/banner";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import FellowshipBreadcrumb from "next-common/components/fellowship/breadcrumb";
import FellowshipReferendumSideBar from "next-common/components/pages/components/fellowship/referendum/sidebar";
import CheckUnFinalized from "next-common/components/pages/components/fellowship/checkUnFinalized";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import FellowshipReferendaDetail from "next-common/components/detail/fellowship";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import FellowshipReferendaDetailMultiTabs from "next-common/components/pages/components/tabs/fellowshipReferendaDetailMultiTabs";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import CommentsWithSwitchTabs from "next-common/components/detail/common/commentsWithSwitchTabs";
import { isNil } from "lodash-es";
import SwitchCommentActionsProvider from "next-common/context/fellowship/switchCommentActionsProvider";
import { CommentsContent } from "next-common/components/detail/common/contentWithComment";

function FellowshipContent() {
  const post = usePost();
  const { fellowshipParams } = usePageProps();

  useSubReferendumInfo("fellowshipReferenda");

  useSubscribePostDetail(post?.referendumIndex);

  return (
    <CollectivesProvider section="fellowship" params={fellowshipParams}>
      <CommentsWithSwitchTabs>
        <SwitchCommentActionsProvider>
          <CommentsContent>
            <FellowshipReferendaDetail />
            <FellowshipReferendumSideBar />
            <FellowshipReferendaDetailMultiTabs />
          </CommentsContent>
        </SwitchCommentActionsProvider>
      </CommentsWithSwitchTabs>
    </CollectivesProvider>
  );
}

function UnFinalizedBreadcrumb({ id }) {
  return (
    <BreadcrumbWrapper>
      <Breadcrumb
        items={[
          {
            path: "/fellowship",
            content: "Fellowship",
          },
          {
            content: (
              <>
                <BreadcrumbHideOnMobileText>
                  Referendum
                </BreadcrumbHideOnMobileText>{" "}
                {`#${id}`}
              </>
            ),
          },
        ]}
      />
    </BreadcrumbWrapper>
  );
}

function ReferendumPageCommon({ breadcrumbs, postContent }) {
  const detail = usePost();

  const seoInfo = {
    title: detail?.title,
    desc: getMetaDesc(detail),
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <DetailLayout breadcrumbs={breadcrumbs} seoInfo={seoInfo} hasSidebar>
      {postContent}
    </DetailLayout>
  );
}

function ReferendumNullPage() {
  const { id } = usePageProps();
  return (
    <ReferendumPageCommon
      breadcrumbs={<UnFinalizedBreadcrumb id={id} />}
      postContent={<CheckUnFinalized id={id} />}
    />
  );
}

function ReferendumPageWithPost() {
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <ReferendumPageCommon
        breadcrumbs={<FellowshipBreadcrumb />}
        postContent={<FellowshipContent />}
      />
    </MigrationConditionalApiProvider>
  );
}

function ReferendumPageImpl() {
  const detail = usePost();
  if (!detail) {
    return <ReferendumNullPage />;
  }

  return <ReferendumPageWithPost />;
}

export default function ReferendumPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <ReferendaPalletProvider pallet="fellowshipReferenda">
        <ReferendumPageImpl />
      </ReferendaPalletProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: detail } = await backendApi.fetch(
    getFellowshipReferendumUrl(id),
  );
  if (!detail) {
    return getNullDetailProps(id);
  }

  const [
    comments,
    tracksProps,
    { result: fellowshipParams = {} },
    { result: fellowshipTracksDetail = {} },
    { evidence, evidenceComments },
  ] = await Promise.all([
    fetchDetailComments(
      getFellowshipReferendumCommentsUrl(detail?._id),
      context,
    ),
    fetchOpenGovTracksProps(),
    backendApi.fetch(fellowshipParamsApi),
    backendApi.fetch(fellowshipTracksApi),
    getEvidenceProps(detail, context),
  ]);

  return {
    props: {
      detail: fillCommentsCount(detail, comments, evidenceComments),
      comments: comments ?? EmptyList,
      evidenceComments: evidenceComments ?? EmptyList,
      evidence,

      ...tracksProps,
      fellowshipParams,
      fellowshipTracksDetail,
    },
  };
});

function fillCommentsCount(detail = {}, comments, evidenceComments) {
  const resolvedComments = comments ?? EmptyList;
  const resolvedEvidenceComments = evidenceComments ?? EmptyList;
  const total = resolvedComments.total + resolvedEvidenceComments.total;

  return {
    ...detail,
    polkassemblyCommentsCount: isNil(detail?.polkassemblyCommentsCount)
      ? detail?.polkassemblyCommentsCount
      : total,
    commentsCount: isNil(detail?.commentsCount) ? detail?.commentsCount : total,
  };
}

async function getEvidenceProps(detail, context) {
  const memberships = detail?.onchainData?.memberships || [];
  const firstMembership = memberships[0];

  if (isNil(firstMembership)) {
    return {
      evidence: null,
      evidenceComments: EmptyList,
    };
  }

  const [{ result: evidence }, evidenceComments] = await Promise.all([
    backendApi.fetch(
      `fellowship/members/${firstMembership?.who}/evidences/${firstMembership?.evidence.cid}`,
    ),
    fetchDetailComments(
      `fellowship/members/${firstMembership?.who}/evidences/${firstMembership?.evidence.cid}/comments`,
      context,
    ),
  ]);

  return {
    evidence,
    evidenceComments,
  };
}
