import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import CoretimeSalesHistory from "next-common/components/coretime/sales/history";
import ActiveCoretimeSale from "next-common/components/coretime/sales/active";
import { createStore } from "next-common/store";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import queryCoretimeCurrentSale from "next-common/services/gql/coretime/currentSale";
import { CoretimeActiveSaleProvider } from "next-common/context/coretime/sale";
import queryCoretimeConfiguration from "next-common/services/gql/coretime/configuration";
import queryCoretimeStatus from "next-common/services/gql/coretime/status";
import CoretimeCommonProvider from "next-common/context/coretime/common";
import useLoopCoretimeScanHeight from "next-common/hooks/coretime/useLoopCoretimeScanHeight";
import RelayInfoProvider from "next-common/context/relayInfo";

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

export default function CoretimeSalesPage() {
  if (!isCoretimeSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <CoretimeCommonProvider>
              <CoretimeActiveSaleProvider>
                <CoretimeSalesPageImpl />
              </CoretimeActiveSaleProvider>
            </CoretimeCommonProvider>
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function CoretimeSalesPageImpl() {
  const { description } = useChainSettings();
  useLoopCoretimeScanHeight();

  return (
    <ListLayout title="Coretime" description={description}>
      <div className="space-y-6">
        <ActiveCoretimeSale />
        <CoretimeSalesHistory />
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
    const configuration = await queryCoretimeConfiguration();
    const status = await queryCoretimeStatus();
    return {
      props: {
        coretimeSale: sale,
        configuration,
        status,
      },
    };
  })(ctx);
};
