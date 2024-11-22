import ListLayout from "next-common/components/layout/ListLayout";
import ApiProvider from "next-common/context/api";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import RelayInfoProvider from "next-common/context/relayInfo";
import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { Provider } from "react-redux";

const isAssetHubSupported = !!getChainSettings(CHAIN).modules?.assethub;

let chain;
let store;

if (isAssetHubSupported) {
  chain = `${CHAIN}-assethub`;
  store = createStore({
    chain,
    reducer: commonReducers,
  });
}

export default function AssetHubAssetsPage() {
  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <AssetHubAssetsPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function AssetHubAssetsPageImpl() {
  const { description } = useChainSettings();

  return (
    <ListLayout title="Asset Hub" description={description}>
      <div className="space-y-6">
        <div>Assets page</div>
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isAssetHubSupported) {
    return {
      notFound: true,
    };
  }

  return withCommonProps(async () => {
    return {
      props: {},
    };
  })(ctx);
};
