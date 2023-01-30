import { useCallback, useEffect } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import { TipStateMap } from "utils/viewfuncs";
import getMetaDesc from "next-common/utils/post/getMetaDesc";

import DetailItem from "components/detailItem";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Timeline from "components/tip/timeline";
import Metadata from "components/tip/metadata";
import Tipper from "components/tipper";
import useUniversalComments from "components/universalComments";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  setTipCountDownBlockNum,
  tipCountDownBlockNumSelector,
} from "next-common/store/reducers/tipSlice";
import isNil from "lodash.isnil";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import Loading from "next-common/components/loading";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import { getBannerUrl } from "next-common/utils/banner";
import { hashEllipsis } from "next-common/utils";
import {
  PostProvider,
  usePost,
  usePostDispatch,
} from "next-common/context/post";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import useApi from "next-common/utils/hooks/useApi";
import fetchAndUpdatePost from "next-common/context/post/update";
import { useDetailType } from "next-common/context/page";
import CheckUnFinalized from "components/tip/checkUnFinalized";

const TipCountDown = ({ meta = {}, state }) => {
  const nowHeight = useSelector(latestHeightSelector);
  const tipCountdownBlockNum = useSelector(tipCountDownBlockNumSelector);
  const closes = meta.closes;
  if (isNil(closes) || !state || state !== TipStateMap.Tipping) {
    return null;
  }

  if (isNil(nowHeight) || isNil(tipCountdownBlockNum)) {
    return <Loading />;
  }

  const startHeight = closes - tipCountdownBlockNum;

  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={startHeight}
        targetHeight={closes}
        prefix="Closable"
      />
    </NoticeWrapper>
  );
};

function TreasuryTipContent({ comments }) {
  const post = usePost();
  const postDispatch = usePostDispatch();
  const type = useDetailType();
  const api = useApi();

  const chainData = post?.onchainData ?? {};
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (api) {
      dispatch(
        setTipCountDownBlockNum(api.consts.tips.tipCountdown.toNumber())
      );
    }
  }, [api, dispatch]);

  const refreshPageData = useCallback(async () => {
    fetchAndUpdatePost(postDispatch, type, post?._id);
  }, [post, type, postDispatch]);

  const onEndorseFinalized = useWaitSyncBlock("Tip endorsed", refreshPageData);
  const onCloseTipFinalized = useWaitSyncBlock("Tip closed", refreshPageData);
  const onRetractFinalized = useWaitSyncBlock("Tip retracted", refreshPageData);

  return (
    <>
      <DetailItem
        onReply={focusEditor}
        countDown={
          <TipCountDown meta={chainData.meta} state={chainData.state?.state} />
        }
      />
      <Tipper
        chainData={chainData}
        onEndorseFinalized={onEndorseFinalized}
        onCloseTipFinalized={onCloseTipFinalized}
        onRetractFinalized={onRetractFinalized}
      />
      <Metadata tip={post?.onchainData} />
      <Timeline tip={post?.onchainData} />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${hashEllipsis(detail?.hash)}`;
    postContent = <TreasuryTipContent comments={comments} />;
  } else {
    const hash = id?.split("_").pop();
    breadcrumbItemName = `#${hashEllipsis(hash)}`;
    postContent = <CheckUnFinalized id={hash} />;
  }

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Treasury",
    },
    {
      content: "Tips",
      path: "/treasury/tips",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={detail}>
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

        {postContent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await nextApi.fetch(`treasury/tips/${id}`);

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        comments: EmptyList,
      },
    };
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/tips/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
