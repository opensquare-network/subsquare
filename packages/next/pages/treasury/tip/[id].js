/* eslint-disable react/jsx-key */
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import { getMetaDesc, getTipState } from "utils/viewfuncs";
import { to404 } from "next-common/utils/serverSideUtil";

import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import OutWrapper from "next-common/components/styled/outWrapper";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Layout from "next-common/components/layout";
import Timeline from "components/tip/timeline";
import Metadata from "components/tip/metadata";
import Tipper from "components/tipper";
import MainCard from "next-common/components/styled/mainCard";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default withLoginUserRedux(
  ({ loginUser, detail: tip, comments, chain }) => {
    const [detail, setDetail] = useState(tip);

    const { CommentComponent, focusEditor } = useUniversalComments({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.TREASURY_TIP,
    });

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
    const [isLoadingTip, setIsLoadingTip] = useState(false);

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

    detail.status = getTipState({
      state: detail.onchainData?.state?.state,
      tipsCount: (detail.onchainData?.meta?.tips || []).length,
    });

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
      <Layout
        user={loginUser}
        chain={chain}
        seoInfo={{ title: detail?.title, desc, ogImage: detail?.bannerUrl }}
      >
        <OutWrapper>
          <MainCard className="post-content">
            <Back href={`/treasury/tips`} text="Back to Tips" />
            <DetailItem
              data={detail}
              user={loginUser}
              chain={chain}
              onReply={focusEditor}
              type={detailPageCategory.TREASURY_TIP}
            />
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
              isLoadingTip={isLoadingTip}
              setIsLoadingTip={setIsLoadingTip}
            />
            <Metadata tip={detail?.onchainData} chain={chain} />
            <Timeline tip={detail?.onchainData} chain={chain} />
            {CommentComponent}
          </MainCard>
        </OutWrapper>
      </Layout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

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
      chain,
    },
  };
});
