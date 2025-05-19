import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import ChainProvider from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import RelayInfoProvider from "next-common/context/relayInfo";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleIdentitiesPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/identities"),
);

let chain;
let store;

if (isPeopleSupported) {
  chain = `${CHAIN}-people`;
  store = createStore({
    chain,
    reducer: commonReducers,
  });
}

export default function PeopleIdentitiesPage() {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <PeopleIdentitiesPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
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
