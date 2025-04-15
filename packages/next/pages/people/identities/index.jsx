import { withCommonProps } from "next-common/lib";
import { createStore } from "next-common/store";
import ChainProvider, { useChainSettings } from "next-common/context/chain";
import ApiProvider from "next-common/context/api";
import { Provider } from "react-redux";
import { commonReducers } from "next-common/store/reducers";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import RelayInfoProvider from "next-common/context/relayInfo";
import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";

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

export default function PeopleIdentitiesPage() {
  if (!isPeopleSupported) {
    return null;
  }

  return (
    <RelayInfoProvider>
      <Provider store={store}>
        <ChainProvider chain={chain}>
          <ApiProvider>
            <PeopleOverviewPageImpl />
          </ApiProvider>
        </ChainProvider>
      </Provider>
    </RelayInfoProvider>
  );
}

function PeopleOverviewPageImpl() {
  const { description } = useChainSettings();

  const tabs = [
    {
      value: "identities",
      label: "Identities",
      url: "/people/identities",
      exactMatch: false,
    },
  ];

  return (
    <ListLayout
      title="Identities"
      description={description}
      headContent={<ChainSocialLinks />}
      summary={<div>Identities</div>}
      tabs={tabs}
    >
      <div className="space-y-6">People identities</div>
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
    return {
      props: {},
    };
  })(ctx);
};
