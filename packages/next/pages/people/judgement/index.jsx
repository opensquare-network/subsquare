import { CHAIN } from "next-common/utils/constants";
import { createStore } from "next-common/store";
import { commonReducers } from "next-common/store/reducers";
import { withCommonProps } from "next-common/lib";
import RelayInfoProvider from "next-common/context/relayInfo";
import ApiProvider from "next-common/context/api";
import ChainProvider from "next-common/context/chain";
import { Provider } from "react-redux";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import getChainSettings from "next-common/utils/consts/settings";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

const PeopleOverviewPageImpl = dynamicClientOnly(() =>
  import("next-common/components/people/judgement"),
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

export const PeopleGlobalProvider = ({ children }) => {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>{children}</ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
};

export default function PeoplePage() {
  return (
    <PeopleGlobalProvider>
      <PeopleOverviewPageImpl />
    </PeopleGlobalProvider>
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
