import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "next-common/components/comment";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Editor from "next-common/components/comment/editor";
import { useRef, useState } from "react";
import Layout from "components/layout";
import User from "next-common/components/user";
import { getNode, getTimelineStatus, toPrecision } from "utils";
import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import { getFocusEditor, getOnReply } from "next-common/utils/post";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { to404 } from "next-common/utils/serverSideUtil";
import { TYPE_TREASURY_BOUNTY } from "utils/viewConstants";
import { createMotionTimelineData } from "../../../utils/timeline/motion";
import sortTimeline from "../../../utils/timeline/sort";
import { getMetaDesc } from "../../../utils/viewfuncs";
import DetailPageWrapper from "next-common/components/styled/detailPageWrapper";
import BountyMetadata from "next-common/components/treasury/bounty/metadata";
import useMentionList from "next-common/utils/hooks/useMentionList";
import ChildBountiesTable from "../../../components/bounty/childBountiesTable";

export default withLoginUserRedux(
  ({ loginUser, detail, childBounties, comments, chain }) => {
    const postId = detail._id;

    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );

    const node = getNode(chain);
    if (!node) {
      return null;
    }
    const decimals = node.decimals;
    const symbol = node.symbol;

    const getTimelineData = (args, method) => {
      switch (method) {
        case "BountyExtended":
          return {
            ...args,
            caller: <User chain={chain} add={args.caller} fontSize={14} />,
          };
        case "acceptCurator":
          return {
            ...args,
            curator: <User chain={chain} add={args.curator} fontSize={14} />,
          };
        case "proposeBounty":
          return {
            ...args,
            value: `${toPrecision(args.value ?? 0, decimals)} ${symbol}`,
          };
        case "BountyRejected":
          return {
            ...args,
            slashed: `${toPrecision(args.slashed ?? 0, decimals)} ${symbol}`,
          };
        case "Proposed":
          return {
            Index: `#${args.index}`,
          };
        case "BountyClaimed":
          return {
            Beneficiary: (
              <User chain={chain} add={args.beneficiary} fontSize={14} />
            ),
            Payout: `${toPrecision(args.payout ?? 0, decimals)} ${symbol}`,
          };
        case "Awarded":
        case "BountyAwarded":
          return {
            Beneficiary: (
              <User chain={chain} add={args.beneficiary} fontSize={14} />
            ),
            Award: `${toPrecision(args.award ?? 0, decimals)} ${symbol}`,
          };
      }
      return args;
    };

    const timelineData = (detail?.onchainData?.timeline || []).map((item) => {
      const indexer = item.extrinsicIndexer ?? item.indexer;
      return {
        indexer,
        time: dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss"),
        status: getTimelineStatus("bounty", item.method ?? item.name),
        data: getTimelineData(item.args, item.method ?? item.name),
      };
    });

    detail?.onchainData?.motions?.forEach((motion) => {
      const motionTimelineData = createMotionTimelineData(motion, chain);
      timelineData.push(motionTimelineData);
    });
    sortTimeline(timelineData);

    const users = useMentionList(detail, comments, chain);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor,
      chain
    );

    detail.status = detail.onchainData?.state?.state;

    const desc = getMetaDesc(detail, "Bounty");
    return (
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc }}
      >
        <DetailPageWrapper className="post-content">
          <Back href={`/treasury/bounties`} text="Back to Bounties" />
          <DetailItem
            data={detail}
            user={loginUser}
            chain={chain}
            onReply={focusEditor}
            type={TYPE_TREASURY_BOUNTY}
          />
          <BountyMetadata meta={detail.onchainData?.meta} chain={chain} />
          <ChildBountiesTable {...{ childBounties, decimals, symbol }} />
          <Timeline
            data={timelineData}
            chain={chain}
            type={TYPE_TREASURY_BOUNTY}
          />
          <CommentsWrapper>
            <Comments
              data={comments}
              user={loginUser}
              chain={chain}
              onReply={onReply}
            />
            {loginUser && (
              <Editor
                postId={postId}
                chain={chain}
                ref={editorWrapperRef}
                setQuillRef={setQuillRef}
                {...{ contentType, setContentType, content, setContent, users }}
                type={TYPE_TREASURY_BOUNTY}
              />
            )}
          </CommentsWrapper>
        </DetailPageWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }, { result: childBounties }] = await Promise.all([
    nextApi.fetch(`treasury/bounties/${id}`),
    nextApi.fetch(`treasury/bounties/${id}/child-bounties`, { pageSize: 5 }),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/bounties/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail,
      childBounties: childBounties ?? EmptyList,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
