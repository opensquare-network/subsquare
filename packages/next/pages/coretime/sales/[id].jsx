import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import ChainProvider from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { CoretimeDetailSaleProvider } from "next-common/context/coretime/sale";
import queryCoretimeConfiguration from "next-common/services/gql/coretime/configuration";
import queryCoretimeStatus from "next-common/services/gql/coretime/status";
import CoretimeCommonProvider from "next-common/context/coretime/common";
import useLoopCoretimeScanHeight from "next-common/hooks/coretime/useLoopCoretimeScanHeight";
import RelayInfoProvider from "next-common/context/relayInfo";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { usePost } from "next-common/context/post";
import CoretimeSalesDetail from "next-common/components/detail/coretime/sales";
import BaseLayout from "next-common/components/layout/baseLayout";
import { cn } from "next-common/utils";
import Breadcrumbs from "next-common/components/layout/DetailLayout/breadcrumbs";
import queryCoretimeDetailSale from "next-common/services/gql/coretime/detailSale";
import {
  queryCoretimeSaleRenewalsChart,
  queryCoretimeSalePurchasesChart,
} from "next-common/services/gql/coretime/chart";

const isCoretimeSupported = !!getChainSettings(CHAIN).modules?.coretime;

let chain;
let store;

if (isCoretimeSupported) {
  chain = `${CHAIN}-coretime`;
  store = createStore({
    chain,
    reducer: commonReducers,
  });
}

export default function CoretimeSaleDetailPage() {
  if (!isCoretimeSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <CoretimeCommonProvider>
              <CoretimeDetailSaleProvider>
                <CoretimeSalesDetailPageImpl />
              </CoretimeDetailSaleProvider>
            </CoretimeCommonProvider>
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function CoretimeSalesDetailPageImpl() {
  useLoopCoretimeScanHeight();

  const post = usePost();

  const desc = getMetaDesc(post);

  const seoInfo = {
    title: post?.title,
    desc,
    ogImage: getBannerUrl(post?.bannerCid),
  };

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="flex-1">
        <div className={cn("px-6 py-6 mx-auto max-w-[1200px]", "max-sm:px-0")}>
          <Breadcrumbs />
          <CoretimeSalesDetail />
        </div>
      </div>
    </BaseLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isCoretimeSupported) {
    return {
      notFound: true,
    };
  }

  const { id } = ctx.query;

  return withCommonProps(async () => {
    const coretimeSale = await queryCoretimeDetailSale(id);
    const configuration = await queryCoretimeConfiguration();
    const status = await queryCoretimeStatus();
    const coretimeSaleRenewalsChart = await queryCoretimeSaleRenewalsChart(id, {
      limit: coretimeSale?.renewalCount,
    });
    const coretimeSalePurchasesChart = await queryCoretimeSalePurchasesChart(
      id,
      {
        limit: coretimeSale?.purchaseCount,
      },
    );

    return {
      props: {
        coretimeSale,
        configuration,
        status,
        coretimeSaleRenewalsChart,
        coretimeSalePurchasesChart,
      },
    };
  })(ctx);
};
