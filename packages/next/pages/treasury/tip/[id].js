/* eslint-disable react/jsx-key */
import styled from "styled-components";
import { useApi, useCall } from "utils/hooks";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import findLastIndex from "lodash.findlastindex";

import { withLoginUser, withLoginUserRedux } from "lib";
import { EmptyList } from "utils/constants";
import { getTimelineStatus, getNode, toPrecision } from "utils";
import { TYPE_TREASURY_TIP } from "utils/viewConstants";
import { getMetaDesc, getTipState } from "utils/viewfuncs";
import { getFocusEditor, getMentionList, getOnReply } from "utils/post";
import { to404 } from "utils/serverSideUtil";

import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { ssrNextApi as nextApi } from "services/nextApi";
import Input from "components/comment/input";
import Layout from "components/layout";
import Timeline from "components/timeline";
import User from "components/user";
import KVList from "next-common/components/kvList";
import Links from "components/timeline/links";
import ReasonLink from "components/reasonLink";
import SEO from "components/SEO";
import Tipper from "components/tipper";

import { shadow_100 } from "styles/componentCss";

const OutWrapper = styled.div`
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  position: relative;
`;

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 768px;
  @media screen and (max-width: 1444px) {
    max-width: 848px;
    margin: 0 auto;
  }
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
const FlexEnd = styled.div`
  display: flex;
  justify-content: right;
`;

const isClosed = (timeline) => {
  return (timeline || []).some((item) => item.method === "TipClosed");
};

const getClosedTimelineData = (timeline = []) => {
  let firstTipIndex = timeline.findIndex((item) => item?.method === "tip");
  const lastTipIndex = findLastIndex(
    timeline,
    (item) => item?.method === "tip"
  );
  if (firstTipIndex > 0) {
    firstTipIndex--;
  }

  if (firstTipIndex >= lastTipIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstTipIndex && idx <= lastTipIndex
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstTipIndex || idx > lastTipIndex
  );
  const fd = [...foldItems];
  return [fd, ...notFoldItems];
};

export default withLoginUserRedux(
  ({ loginUser, detail: tip, comments, chain, siteUrl }) => {
    const [detail, setDetail] = useState(tip);
    const postId = detail._id;

    const editorWrapperRef = useRef(null);
    const [quillRef, setQuillRef] = useState(null);
    const [content, setContent] = useState("");
    const [contentType, setContentType] = useState(
      loginUser?.preference.editor || "markdown"
    );

    const [tipIsFinal, setTipIsFinal] = useState(
      ["TipClosed", "TipRetracted"].includes(detail?.onchainData?.state?.state)
    );

    // If the tip is not final, we'd need to look for tip state from the chain first.
    const shouldGetTipsFromNode = !tipIsFinal;
    const tipHash = detail?.onchainData?.hash;
    const tipsInDb = detail?.onchainData?.meta?.tips || [];

    const [loading, setLoading] = useState(shouldGetTipsFromNode);
    const [tips, setTips] = useState(tipsInDb);

    const api = useApi(chain);
    const councilMembers = useCall(
      (api?.query.council || api?.query.generalCouncil)?.members,
      []
    );
    const councilTippers = councilMembers?.toJSON() || [];
    const userIsTipper = councilTippers?.some((address) =>
      loginUser?.addresses?.some(
        (item) => item.address === address && item.chain === chain
      )
    );
    // Used to trigger tips updating
    const [tipsNeedUpdate, setTipsNeedUpdate] = useState(Date.now());

    useEffect(() => {
      if (shouldGetTipsFromNode && api) {
        api.query.tips.tips(tipHash).then((tip) => {
          const normalizedTip = tip.toJSON();
          if (normalizedTip) {
            // Repalce the tips read from db with the current on-chain state
            setTips(normalizedTip?.meta?.tips);
          } else {
            // If the tip is null,
            // It is considered to have been closed/retracted already
            setTipIsFinal(true);
          }
          setLoading(false);
        });
      }
    }, [api, shouldGetTipsFromNode, tipHash, tipsNeedUpdate]);

    const node = getNode(chain);
    if (!node) {
      return null;
    }
    const decimals = node.decimals;
    const symbol = node.symbol;

    const getTimelineData = (args, method) => {
      switch (method) {
        case "reportAwesome":
          return {
            Finder: (
              <FlexEnd>
                <User chain={chain} add={args.finder} />
              </FlexEnd>
            ),
            Beneficiary: (
              <FlexEnd>
                <User chain={chain} add={args.beneficiary} />
              </FlexEnd>
            ),
            Reason: args.reason,
          };
        case "tip":
          const value = args.award ? args.award : args.value;
          return {
            Tipper: (
              <FlexEnd>
                <User chain={chain} add={args.tipper} />
              </FlexEnd>
            ),
            Value: `${toPrecision(value ?? 0, decimals)} ${symbol}`,
          };
        case "TipClosed":
          return {
            Beneficiary: (
              <FlexEnd>
                <User chain={chain} add={args.beneficiary} />
              </FlexEnd>
            ),
            Payout: `${toPrecision(args.payout ?? 0, decimals)} ${symbol}`,
          };
      }
      return args;
    };

    let timeline = (detail?.onchainData?.timeline || []).map((item) => {
      return {
        time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
        indexer: item.indexer,
        status: getTimelineStatus("tip", item.method),
        data: getTimelineData(item.args, item.method),
        method: item.method,
      };
    });

    if (isClosed(timeline)) {
      timeline = getClosedTimelineData(timeline);
    }

    const users = getMentionList(comments);

    const focusEditor = getFocusEditor(contentType, editorWrapperRef, quillRef);

    const onReply = getOnReply(
      contentType,
      content,
      setContent,
      quillRef,
      focusEditor
    );

    detail.status = getTipState({
      state: detail.onchainData?.state?.state,
      tipsCount: (detail.onchainData?.meta?.tips || []).length,
    });

    const metadata = [
      [
        "Reason",
        <div>
          <ReasonLink text={detail.onchainData?.meta?.reason} />
        </div>,
      ],
      ["Hash", detail.onchainData?.hash],
      [
        "Finder",
        <>
          <User
            chain={chain}
            add={detail.onchainData?.meta?.finder}
            fontSize={14}
          />
          <Links
            chain={chain}
            address={detail.onchainData?.meta?.finder}
            style={{ marginLeft: 8 }}
          />
        </>,
      ],
      [
        "Beneficiary",
        <>
          <User
            chain={chain}
            add={detail.onchainData?.meta?.who}
            fontSize={14}
          />
          <Links
            chain={chain}
            address={detail.onchainData?.meta?.who}
            style={{ marginLeft: 8 }}
          />
        </>,
      ],
    ];

    const updateTips = () => {
      // Trigger tips update
      setTipsNeedUpdate(Date.now());
    };

    const updateTimeline = (tipperAddress) => {
      let times = 6;
      const doUpdate = async () => {
        const { result: newTipDetail } = await nextApi.fetch(
          `treasury/tips/${`${detail._id}`}`
        );

        // Check if user's tip is present in DB
        const tipFound = newTipDetail?.onchainData?.meta?.tips?.some(
          ([address]) => address === tipperAddress
        );
        if (tipFound) {
          setDetail(newTipDetail);
          return;
        }

        // Do next update
        times--;
        if (times > 0) {
          setTimeout(doUpdate, 10 * 1000);
        }
      };
      setTimeout(doUpdate, 10 * 1000);
    };

    const desc = getMetaDesc(detail, "Tip");
    return (
      <Layout user={loginUser} chain={chain}>
        <SEO
          title={detail?.title}
          desc={desc}
          siteUrl={siteUrl}
          chain={chain}
        />
        <OutWrapper>
          <Wrapper className="post-content">
            <Back href={`/treasury/tips`} text="Back to Tips" />
            <DetailItem
              data={detail}
              user={loginUser}
              chain={chain}
              onReply={focusEditor}
              type={TYPE_TREASURY_TIP}
            />
            <KVList title="Metadata" data={metadata} />
            <Tipper
              chain={chain}
              tipIsFinal={tipIsFinal}
              userIsTipper={userIsTipper}
              loading={loading}
              tips={tips}
              councilTippers={councilTippers}
              tipHash={tipHash}
              updateTips={updateTips}
              updateTimeline={updateTimeline}
            />
            <Timeline data={timeline} chain={chain} indent={false} />
            <CommentsWrapper>
              <Comments
                data={comments}
                user={loginUser}
                postId={postId}
                chain={chain}
                onReply={onReply}
              />
              {loginUser && (
                <Input
                  postId={postId}
                  chain={chain}
                  ref={editorWrapperRef}
                  setQuillRef={setQuillRef}
                  {...{
                    contentType,
                    setContentType,
                    content,
                    setContent,
                    users,
                  }}
                  type={TYPE_TREASURY_TIP}
                />
              )}
            </CommentsWrapper>
          </Wrapper>
        </OutWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    ssrNextApi.fetch(`treasury/tips/${id}`),
  ]);

  if (!detail) {
    to404(context);
  }

  const { result: comments } = await ssrNextApi.fetch(
    `treasury/tips/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
      siteUrl: process.env.SITE_URL,
    },
  };
});
