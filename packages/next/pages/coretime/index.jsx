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
import {
  GET_CORETIME_CURRENT_SALE,
  GET_CORETIME_SALE,
} from "next-common/services/gql/coretime";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { isNil } from "lodash-es";

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

export const getServerSideProps = async (ctx) => {
  if (!isCoretimeSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    let props = {};

    try {
      const {
        data: { coretimeCurrentSale = null },
      } =
        (await coretimeClient?.query?.({
          query: GET_CORETIME_CURRENT_SALE,
        })) || {};

      const id = coretimeCurrentSale?.id || null;

      props = {
        id,
        purchaseCount: coretimeCurrentSale?.purchaseCount || null,
        renewalCount: coretimeCurrentSale?.renewalCount || null,
      };

      if (!isNil(id)) {
        const {
          data: { coretimeSale = null },
        } =
          (await coretimeClient?.query?.({
            query: GET_CORETIME_SALE,
            variables: {
              id,
            },
          })) || {};

        if (coretimeSale) {
          props.coretimeSale = coretimeSale;
        }
      }

      return {
        props,
      };
    } catch (_error) {
      /* empty */
    }

    return {
      props,
    };
  })(ctx);
};
