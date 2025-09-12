import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import DelegationLayout from "next-common/components/delegation/layout";
import ReferendaStats from "next-common/components/delegation/stats/referendaStats";
import DemocracyStats from "next-common/components/delegation/stats/democracyStats";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import {
  Democracy,
  ModuleTab,
  Referenda,
  useModuleTab,
} from "next-common/components/profile/votingHistory/common";
import PalletTabs from "next-common/components/profile/delegation/palletTabs";
import getChainSettings from "next-common/utils/consts/settings";
import NoData from "next-common/components/noData";
import { useChainSettings } from "next-common/context/chain";

function Content() {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();
  const hasDemocracyModule = democracy && !democracy?.archived;

  const selectedTabId = useModuleTab();

  if (selectedTabId === Referenda && hasReferenda) {
    return <ReferendaStats />;
  }

  if (selectedTabId === Democracy && hasDemocracyModule) {
    return <DemocracyStats />;
  }

  return (
    <NoData text={`No current ${selectedTabId?.toLowerCase() || ""} data`} />
  );
}

export default function DelegationStatsPage({ defaultType }) {
  return (
    <DelegationLayout>
      <PalletTabs defaultTab={defaultType} shallow={false}>
        <div className="flex justify-between mx-[24px] max-sm:flex-col gap-[12px]">
          <span className="text16Bold text-textPrimary">
            Delegation Statistics
          </span>
          <ModuleTab />
        </div>
        <Content />
      </PalletTabs>
    </DelegationLayout>
  );
}

const getDemocracyProps = async () => {
  const [
    { result: delegatee },
    { result: delegators },
    { result: democracySummary },
  ] = await Promise.all([
    backendApi.fetch("democracy/delegatee", {
      sort: JSON.stringify(["delegatedVotes", "desc"]),
      pageSize: 25,
    }),
    backendApi.fetch("democracy/delegators", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    backendApi.fetch("democracy/summary"),
  ]);

  return {
    defaultType: Democracy,
    delegatee: delegatee ?? EmptyList,
    delegators: delegators ?? EmptyList,
    democracySummary: democracySummary ?? {},
  };
};

const getReferendaProps = async () => {
  const [
    { result: tracksStats },
    { result: delegatee },
    { result: tracksReferendaSummary },
  ] = await Promise.all([
    backendApi.fetch("referenda/tracks"),
    backendApi.fetch("referenda/delegatee", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    backendApi.fetch("referenda/summary"),
  ]);

  return {
    defaultType: Referenda,
    tracksStats: tracksStats ?? [],
    delegatee: delegatee ?? EmptyList,
    tracksReferendaSummary: tracksReferendaSummary ?? [],
  };
};

export const getServerSideProps = withCommonProps(async (ctx) => {
  const { type } = ctx.query;
  const {
    modules: { referenda: hasReferenda, democracy },
  } = getChainSettings(process.env.CHAIN);
  const hasDemocracyModule = democracy && !democracy?.archived;
  const defaultType =
    type ||
    (hasReferenda
      ? Referenda.toLowerCase()
      : hasDemocracyModule
      ? Democracy.toLowerCase()
      : "");

  const tracksProps = await fetchOpenGovTracksProps();

  if (defaultType === Democracy.toLowerCase()) {
    const propsData = await getDemocracyProps();
    return {
      props: {
        defaultType,
        ...propsData,
        ...tracksProps,
      },
    };
  }

  if (defaultType === Referenda.toLowerCase()) {
    const propsData = await getReferendaProps();
    return {
      props: {
        defaultType,
        ...propsData,
        ...tracksProps,
      },
    };
  }

  return {
    props: {
      defaultType,
      ...tracksProps,
    },
  };
});
