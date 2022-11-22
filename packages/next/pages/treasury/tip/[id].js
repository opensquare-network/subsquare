/* eslint-disable react/jsx-key */
import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useCallback, useEffect, useState } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import { TipStateMap } from "utils/viewfuncs";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { to404 } from "next-common/utils/serverSideUtil";

import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Timeline from "components/tip/timeline";
import Metadata from "components/tip/metadata";
import Tipper from "components/tipper";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
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
import { hashEllipsis, isSameAddress } from "next-common/utils";
import { PostProvider } from "next-common/context/post";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

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

export default withLoginUserRedux(({ loginUser, detail: tip, comments }) => {
  const [detail, setDetail] = useState(tip);
  useEffect(() => setDetail(tip), [tip]);
  const isMounted = useIsMounted();

  const chainData = detail?.onchainData ?? {};
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    type: detailPageCategory.TREASURY_TIP,
  });
  const dispatch = useDispatch();

  const [tipIsFinal, setTipIsFinal] = useState(
    ["TipClosed", "TipRetracted"].includes(detail?.onchainData?.state?.state)
  );

  // If the tip is not final, we'd need to look for tip state from the chain first.
  const shouldGetTipsFromNode = !tipIsFinal;
  const tipHash = detail?.onchainData?.hash;
  const tipsInDb = detail?.onchainData?.meta?.tips || [];

  const [loading, setLoading] = useState(shouldGetTipsFromNode);
  const [tips, setTips] = useState(tipsInDb);

  const api = useApi();
  const councilMembers = useCall(
    (api?.query.council || api?.query.generalCouncil)?.members,
    []
  );
  const councilTippers = councilMembers?.toJSON() || [];
  const userIsTipper = councilTippers?.some((address) =>
    isSameAddress(loginUser?.address, address)
  );
  // Used to trigger tips updating
  const [tipsNeedUpdate, setTipsNeedUpdate] = useState(Date.now());
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  useEffect(() => {
    if (api) {
      dispatch(
        setTipCountDownBlockNum(api.consts.tips.tipCountdown.toNumber())
      );
    }
  }, [api, dispatch]);

  useEffect(() => {
    if ((shouldGetTipsFromNode || tipsNeedUpdate) && api) {
      setIsLoadingTip(true);
      api.query.tips
        .tips(tipHash)
        .then((tip) => {
          const normalizedTip = tip.toJSON();
          if (normalizedTip) {
            // Repalce the tips read from db with the current on-chain state
            setTips(normalizedTip?.tips);
          } else {
            // If the tip is null,
            // It is considered to have been closed/retracted already
            setTipIsFinal(true);
          }
          setLoading(false);
        })
        .finally(() => {
          setIsLoadingTip(false);
        });
    }
  }, [api, shouldGetTipsFromNode, tipHash, tipsNeedUpdate]);

  const updateTips = () => {
    // Trigger tips update
    setTipsNeedUpdate(Date.now());
  };

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch(`treasury/tips/${detail._id}`);
    if (result && isMounted.current) {
      setDetail(result);
    }
  }, [detail, isMounted]);

  const onTipFinalized = useWaitSyncBlock("Tip endorsed", refreshPageData);

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Overview",
      path: "/",
    },
    {
      content: "Treasury Tips",
      path: "/treasury/tips",
    },
    {
      content: hashEllipsis(detail?.hash),
    },
  ];

  return (
    <PostProvider post={detail} type={detailPageCategory.TREASURY_TIP}>
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

        <DetailItem
          onReply={focusEditor}
          type={detailPageCategory.TREASURY_TIP}
          countDown={
            <TipCountDown
              meta={chainData.meta}
              state={chainData.state?.state}
            />
          }
        />
        <Tipper
          tipIsFinal={tipIsFinal}
          userIsTipper={userIsTipper}
          loading={loading}
          tips={tips}
          councilTippers={councilTippers}
          tipHash={tipHash}
          onInBlock={updateTips}
          onFinalized={onTipFinalized}
          isLoadingTip={isLoadingTip}
        />
        <Metadata tip={detail?.onchainData} />
        <Timeline tip={detail?.onchainData} />
        {CommentComponent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`treasury/tips/${id}`),
  ]);

  if (!detail) {
    return to404(context);
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
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
