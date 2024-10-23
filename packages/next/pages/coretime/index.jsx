import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import CoretimeSalePanel from "next-common/components/coretime/salePanel";
import CoretimeSalesHistorySection from "next-common/components/coretime/salesHistorySection";
import { createStore } from "next-common/store";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import queryCoretimeCurrentSale from "next-common/services/gql/coretime/currentSale";
import { CoretimeActiveSaleProvider } from "next-common/context/coretime/sale";

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

export default function CoretimePage() {
  if (!isCoretimeSupported) {
    return null;
  }

  return (
    <Provider store={store}>
      <ChainProvider chain={chain}>
        <ApiProvider>
          <CoretimeActiveSaleProvider>
            <CoretimeOverviewPageImpl />
          </CoretimeActiveSaleProvider>
        </ApiProvider>
      </ChainProvider>
    </Provider>
  );
}

function CoretimeOverviewPageImpl() {
  const { description } = useChainSettings();

  return (
    <ListLayout title="Coretime" description={description}>
      <div className="space-y-6">
        <CoretimeSalePanel />
        <CoretimeSalesHistorySection />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isCoretimeSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    const sale = await queryCoretimeCurrentSale();
    // todo: query configuration and status
    return {
      props: {
        coretimeSale: sale,
      },
    };
  })(ctx);
};
