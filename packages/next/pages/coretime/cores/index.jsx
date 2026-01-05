import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import ChainProvider from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import queryCoretimeCurrentSale from "next-common/services/gql/coretime/currentSale";
import { CoretimeActiveSaleProvider } from "next-common/context/coretime/sale";
import getCoretimeCommonProps from "next-common/services/serverSide/getCoretimeCommonProps";
import CoretimeCommonProvider from "next-common/context/coretime/common";
import RelayInfoProvider from "next-common/context/relayInfo";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import CoretimeCores from "next-common/components/coretime/cores";

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

export default function CoretimeCoresPage() {
  if (!isCoretimeSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <CoretimeActiveSaleProvider>
              <CoretimeCommonProvider>
                <CoretimeCoresPageImpl />
              </CoretimeCommonProvider>
            </CoretimeActiveSaleProvider>
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function CoretimeCoresPageImpl() {
  const title = "Cores";
  const description = "Status of coretime cores";

  return (
    <ListLayout
      title={title}
      seoInfo={{
        rawTitle: generateLayoutRawTitle(title),
        desc: description,
      }}
      description={description}
    >
      <div className="space-y-6">
        <CoretimeCores />
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
    const commonProps = await getCoretimeCommonProps();

    return {
      ...(commonProps || {}),
      props: {
        ...(commonProps?.props || {}),
        coretimeSale: sale,
      },
    };
  })(ctx);
};
