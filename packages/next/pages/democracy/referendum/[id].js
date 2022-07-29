/* eslint-disable react/jsx-key */
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "next-common/components/layout";
import OutWrapper from "next-common/components/styled/outWrapper";
import React, { useEffect, useState } from "react";
import DetailItem from "components/detailItem";
import Vote from "components/referenda/vote";
import { to404 } from "next-common/utils/serverSideUtil";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { getMetaDesc } from "../../../utils/viewfuncs";
import Timeline from "components/referenda/timeline";
import ReferendumMetadata from "next-common/components/democracy/metadata";
import MainCard from "next-common/components/styled/mainCard";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    loginUser,
    chain,
    type: detailPageCategory.DEMOCRACY_REFERENDUM,
  });

  const api = useApi(chain);

  const [referendumStatus, setReferendumStatus] = useState(
    detail?.onchainData?.status ||
      detail?.onchainData?.info?.ongoing ||
      detail?.onchainData?.meta
  );
  const isMounted = useIsMounted();
  const [isLoadingReferendumStatus, setIsLoadingReferendumStatus] =
    useState(false);

  const timeline = detail?.onchainData?.timeline || [];
  const voteFinished = [
    "Executed",
    "Passed",
    "NotPassed",
    "Cancelled",
    "Canceled",
    "PreimageInvalid",
    "PreimageMissing",
  ].includes(timeline[timeline.length - 1]?.method);

  useEffect(() => {
    if (voteFinished) {
      return;
    }

    setIsLoadingReferendumStatus(true);
    api?.query.democracy
      .referendumInfoOf(detail?.referendumIndex)
      .then((referendumInfo) => {
        const data = referendumInfo.toJSON();
        if (data?.ongoing && isMounted.current) {
          setReferendumStatus(data?.ongoing);
        }
      })
      .finally(() => {
        setIsLoadingReferendumStatus(false);
      });
  }, [api, detail, isMounted, voteFinished]);

  detail.status = detail?.onchainData?.state?.state;

  const desc = getMetaDesc(detail, "Referendum");

  return (
    <Layout
      user={loginUser}
      chain={chain}
      seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
    >
      <OutWrapper>
        <MainCard className="post-content">
          <Back href={`/democracy/referendums`} text="Back to Referendas" />
          <DetailItem
            data={detail}
            onReply={focusEditor}
            user={loginUser}
            chain={chain}
            type={detailPageCategory.DEMOCRACY_REFERENDUM}
          />

          <Vote
            referendumInfo={detail?.onchainData?.info}
            referendumStatus={referendumStatus}
            setReferendumStatus={setReferendumStatus}
            chain={chain}
            referendumIndex={detail?.referendumIndex}
            isLoadingReferendumStatus={isLoadingReferendumStatus}
            setIsLoadingReferendumStatus={setIsLoadingReferendumStatus}
          />

          <ReferendumMetadata
            api={api}
            proposer={detail?.proposer}
            status={referendumStatus}
            call={
              detail?.onchainData?.preImage?.call || detail?.onchainData?.call
            }
            shorten={detail?.onchainData?.preImage?.shorten}
            chain={chain}
            onchainData={detail?.onchainData}
          />

          <Timeline
            timeline={detail?.onchainData?.timeline}
            chain={chain}
            type={detailPageCategory.DEMOCRACY_REFERENDUM}
          />
          {CommentComponent}
        </MainCard>
      </OutWrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/referendums/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const postId = detail?._id;

  const { result: comments } = await nextApi.fetch(
    `democracy/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
