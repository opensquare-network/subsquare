import { AssetMetadataProvider } from "next-common/components/assets/context/assetMetadata";
import NoWalletConnected from "next-common/components/assets/noWalletConnected";
import WalletAssetList from "next-common/components/assets/walletAssetList";
import ApiProvider from "next-common/context/api";
import ChainProvider from "next-common/context/chain";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import RelayInfoProvider from "next-common/context/relayInfo";
import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import multiAccountsSlice from "next-common/store/reducers/multiAccountsSlice";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { Provider } from "react-redux";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export const isAssetHubSupported = !!getChainSettings(CHAIN).modules?.assethub;

let chain;
let store;

if (isAssetHubSupported) {
  chain = `${CHAIN}-assethub`;
  store = createStore({
    chain,
    reducer: {
      ...commonReducers,
      multiAccounts: multiAccountsSlice,
    },
  });
}

function ConditionRelayInfoProvider({ children }) {
  if (isAssetHubMigrated()) {
    return children;
  }

  return <RelayInfoProvider>{children}</RelayInfoProvider>;
}

function ConditionApiProvider({ children }) {
  if (isAssetHubMigrated()) {
    return children;
  }

  return <ApiProvider>{children}</ApiProvider>;
}

export function AssetHubPageProvider({ children }) {
  return (
    <ConditionRelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ConditionApiProvider>{children}</ConditionApiProvider>
        </ChainProvider>
      </Provider>
    </ConditionRelayInfoProvider>
  );
}

export default function AssetHubPage() {
  return (
    <AssetHubPageProvider>
      <AssetHubOverviewPageImpl />
    </AssetHubPageProvider>
  );
}

function AssetHubOverviewPageImpl() {
  const realAddress = useRealAddress();
  useExistentialDeposit();

  if (!realAddress) {
    return <NoWalletConnected />;
  }

  return (
    <AssetMetadataProvider>
      <RelayChainApiProvider>
        <WalletAssetList />
      </RelayChainApiProvider>
    </AssetMetadataProvider>
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
