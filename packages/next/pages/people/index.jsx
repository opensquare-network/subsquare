import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import queryCoretimeCurrentSale from "next-common/services/gql/coretime/currentSale";
import queryCoretimeConfiguration from "next-common/services/gql/coretime/configuration";
import queryCoretimeStatus from "next-common/services/gql/coretime/status";
import RelayInfoProvider from "next-common/context/relayInfo";
import {
  queryCoretimeSalePurchasesChart,
  queryCoretimeSaleRenewalsChart,
} from "next-common/services/gql/coretime/chart";
import ListLayout from "next-common/components/layout/ListLayout";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

let chain;
let store;

if (isPeopleSupported) {
  chain = `${CHAIN}-people`;
  store = createStore({
    chain,
    reducer: commonReducers,
  });
}

export default function CoretimePage() {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <CoretimeOverviewPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function CoretimeOverviewPageImpl() {
  const { description } = useChainSettings();

  return (
    <ListLayout title="Identities" description={description}>
      <div className="space-y-6">People</div>
    </ListLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    const sale = await queryCoretimeCurrentSale();
    const id = sale?.id;
    const configuration = await queryCoretimeConfiguration();
    const status = await queryCoretimeStatus();
    const coretimeSaleRenewalsChart = await queryCoretimeSaleRenewalsChart(id, {
      limit: sale?.renewalCount,
    });
    const coretimeSalePurchasesChart = await queryCoretimeSalePurchasesChart(
      id,
      {
        limit: sale?.purchaseCount,
      },
    );

    return {
      props: {
        coretimeSale: sale,
        configuration,
        status,
        coretimeSaleRenewalsChart,
        coretimeSalePurchasesChart,
      },
    };
  })(ctx);
};
