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
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import IdentityIcon from "next-common/components/Identity/identityIcon";
import IdentitiesTable from "./table";

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
      summary={<IdentitiesSummary directCount={2312} subCount={2312} />}
      tabs={tabs}
    >
      <div className="space-y-6">
        <IdentitiesTable />
      </div>
    </ListLayout>
  );
}

function IdentitiesSummary({
  className = "",
  directCount,
  subCount,
  identityDetail,
}) {
  const IdentityList = identityDetail
    ? [
        {
          identity: { info: { status: "VERIFIED" } },
          lanel: "Verified",
          count: directCount,
        },
        {
          identity: { info: { status: "LINKED" } },
          lanel: "Not verified",
          count: subCount,
        },
        {
          identity: { info: { status: "ERRONEOUS" } },
          lanel: "Erroneous",
          count: subCount,
        },
      ]
    : [];

  return (
    <SummaryLayout className={className}>
      <SummaryItem title="Direct Identities">
        {directCount}
        <div className="flex flex-col gap-y-0.5 mt-1">
          {IdentityList.map((item) => (
            <div key={item.identity.info.status} className="flex gap-x-2">
              <IdentityIcon identity={item.identity} />
              <span className="text-textTertiary text12Medium">
                {item.lanel}
              </span>
              <span className="text-textPrimary text12Medium">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </SummaryItem>
      <SummaryItem title="Sub Identities">{subCount}</SummaryItem>
    </SummaryLayout>
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
