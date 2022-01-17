/* eslint-disable react/jsx-key */
import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Layout from "components/layout";
import Comments from "components/comment";
import Input from "components/comment/input";
import { useEffect, useRef, useState } from "react";
import DetailItem from "components/detailItem";
import KVList from "components/kvList";
import User from "components/user";
import Links from "components/timeline/links";
import Vote from "components/referenda/vote";
import Timeline from "components/timeline";
import MotionProposal from "components/motion/motionProposal";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import { shadow_100 } from "styles/componentCss";
import { isSafari, to404 } from "utils/serverSideUtil";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import { TYPE_DEMOCRACY_REFERENDUM } from "utils/viewConstants";
import { useApi, useIsMounted } from "utils/hooks";
import { getMetaDesc } from "utils/viewfuncs";
import SEO from "components/SEO";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 848px;
  margin: auto;
`;

const CommentsWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;

export default withLoginUserRedux(
  ({ loginUser, detail, publicProposal, comments, chain, siteUrl }) => {
    const api = useApi(chain);
    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );
    const [referendumStatus, setReferendumStatus] = useState(
      detail?.onchainData?.status
    );
    const isMounted = useIsMounted();

    useEffect(() => {
      // Already has the last ongoging status
      if (referendumStatus) {
        return;
      }

      api?.query.democracy
        .referendumInfoOf(detail.referendumIndex)
        .then((referendumInfo) => {
          const referendumInfoData = referendumInfo.toJSON();
          if (isMounted.current) {
            setReferendumStatus(referendumInfoData?.ongoing);
          }
        });
    }, [api, detail, isMounted, referendumStatus]);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor
    );

    const completeTimeline = (
      publicProposal?.onchainData?.timeline || []
    ).concat(detail?.onchainData?.timeline || []);
    const timelineData = getDemocracyTimelineData(completeTimeline, chain);

    const metadata = [
      [
        "Proposer",
        <>
          <User add={detail.proposer} fontSize={14} />
          <Links
            chain={chain}
            address={detail.proposer}
            style={{ marginLeft: 8 }}
          />
        </>,
      ],
      ["Delay", referendumStatus?.delay],
      ["End", referendumStatus?.end],
      ["Threshold", referendumStatus?.threshold],
    ];

    if (detail?.onchainData?.preImage) {
      metadata.push([
        <MotionProposal
          motion={{ proposal: detail.onchainData.preImage.call }}
          chain={chain}
        />,
      ]);
    }

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail, "Referendum");
    return (
      <Layout user={loginUser} chain={chain}>
        <SEO
          title={detail?.title}
          desc={desc}
          siteUrl={siteUrl}
          chain={chain}
        />
        <Wrapper className="post-content">
          <Back href={`/democracy/referendums`} text="Back to Referendas" />
          <DetailItem
            data={detail}
            onReply={focusEditor}
            user={loginUser}
            chain={chain}
            type={TYPE_DEMOCRACY_REFERENDUM}
          />

          <Vote
            referendumInfo={detail?.onchainData?.info}
            referendumStatus={referendumStatus}
            chain={chain}
          />

          <KVList title={"Metadata"} data={metadata} />

          <Timeline data={timelineData} chain={chain} />

          <CommentsWrapper>
            <Comments
              data={comments}
              user={loginUser}
              postId={detail._id}
              chain={chain}
              onReply={onReply}
            />
            {loginUser && (
              <Input
                postId={detail._id}
                chain={chain}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{
                  contentType,
                  setContentType,
                  content,
                  setContent,
                  users: getMentionList(comments),
                }}
                type={TYPE_DEMOCRACY_REFERENDUM}
              />
            )}
          </CommentsWrapper>
        </Wrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  isSafari(context);
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/referendums/${id}`),
  ]);

  if (!detail) {
    to404(context);
  }

  let publicProposal = null;
  if ((detail.proposalIndex ?? null) !== null) {
    const result = await nextApi.fetch(
      `democracy/proposals/${detail.proposalIndex}`
    );
    publicProposal = result.result;
  }

  const postId = detail?._id;

  const { result: comments } = await nextApi.fetch(
    `democracy/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail: detail ?? {},
      publicProposal,
      comments: comments ?? EmptyList,
      chain,
      siteUrl: process.env.SITE_URL,
    },
  };
});
