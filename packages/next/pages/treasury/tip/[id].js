/* eslint-disable react/jsx-key */
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";

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
import { setTipCountDownBlockNum, tipCountDownBlockNumSelector } from "next-common/store/reducers/tipSlice";
import isNil from "lodash.isnil";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import Loading from "next-common/components/loading";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import { getBannerUrl } from "next-common/utils/banner";
import { isSameAddress } from "next-common/utils";

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
      <TreasuryCountDown startHeight={ startHeight } targetHeight={ closes } prefix="Closable" />
    </NoticeWrapper>
  );
};

export default withLoginUserRedux(
  ({ loginUser, detail: tip, comments, chain }) => {
    const [detail, setDetail] = useState(tip);
    const chainData = detail?.onchainData ?? {};
    const { CommentComponent, focusEditor } = useUniversalComments({
      detail,
      comments,
      loginUser,
      chain,
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

    const api = useApi(chain);
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
        dispatch(setTipCountDownBlockNum(api.consts.tips.tipCountdown.toNumber()))
      }
    }, [api, dispatch])

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

    const updateTimeline = (tipperAddress) => {
      let times = 6;
      const doUpdate = async () => {
        const { result: newTipDetail } = await nextApi.fetch(
          `treasury/tips/${ `${ detail._id }` }`
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

    const desc = getMetaDesc(detail);
    return (
      <DetailWithRightLayout
        user={ loginUser }
        seoInfo={ { title: detail?.title, desc, ogImage: getBannerUrl(detail?.bannerCid) } }
      >
        <Back href={ `/treasury/tips` } text="Back to Tips" />
        <DetailItem
          data={ detail }
          chain={ chain }
          onReply={ focusEditor }
          type={ detailPageCategory.TREASURY_TIP }
          countDown={ <TipCountDown meta={ chainData.meta } state={chainData.state?.state} /> }
        />
        <Tipper
          chain={ chain }
          tipIsFinal={ tipIsFinal }
          userIsTipper={ userIsTipper }
          loading={ loading }
          tips={ tips }
          councilTippers={ councilTippers }
          tipHash={ tipHash }
          updateTips={ updateTips }
          updateTimeline={ updateTimeline }
          isLoadingTip={ isLoadingTip }
          setIsLoadingTip={ setIsLoadingTip }
        />
        <Metadata tip={ detail?.onchainData } chain={ chain } />
        <Timeline tip={ detail?.onchainData } chain={ chain } />
        { CommentComponent }
      </DetailWithRightLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`treasury/tips/${ id }`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/tips/${ detail._id }/comments`,
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
      redux: {
        detail,
        detailType: detailPageCategory.TREASURY_TIP,
      },
    },
  };
});
