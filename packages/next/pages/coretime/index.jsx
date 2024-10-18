import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import CoretimeSalePanel from "next-common/components/coretime/salePanel";
import CoretimeSalesHistorySection from "next-common/components/coretime/salesHistorySection";
import { createStore } from "next-common/store";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { coretimeClient } from "next-common/hooks/apollo";
import { GET_CORETIME_CURRENT_SALE } from "next-common/services/gql/coretime";
import { CHAIN } from "next-common/utils/constants";

const chain = `${CHAIN}-coretime`;
const store = createStore({
  chain,
  reducer: commonReducers,
});

export default function CoretimePage() {
  return (
    <Provider store={store}>
      <ChainProvider chain={chain}>
        <ApiProvider>
          <CoretimePageImpl />
        </ApiProvider>
      </ChainProvider>
    </Provider>
  );
}

function CoretimePageImpl() {
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

export const getServerSideProps = withCommonProps(async () => {
  const { data } = await coretimeClient.query({
    query: GET_CORETIME_CURRENT_SALE,
  });

  return {
    props: {
      id: data?.coretimeCurrentSale?.id,
      purchaseCount: data?.coretimeCurrentSale?.purchaseCount,
      renewalCount: data?.coretimeCurrentSale?.renewalCount,
    },
  };
});
