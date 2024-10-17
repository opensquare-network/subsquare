import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import CoretimeSalePanel from "next-common/components/coretime/salePanel";
import CoretimeSalesHistorySection from "next-common/components/coretime/salesHistorySection";
import { createStore } from "next-common/store";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";

const chain = "coretime";
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
  const { name, description } = useChainSettings();

  return (
    <ListLayout title={name} description={description}>
      <div className="space-y-6">
        <CoretimeSalePanel />
        <CoretimeSalesHistorySection />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps();
