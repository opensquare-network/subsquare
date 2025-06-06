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

function Content() {
  const selectedTabId = useModuleTab();

  if (selectedTabId === Referenda) {
    return <ReferendaStats />;
  }

  if (selectedTabId === Democracy) {
    return <DemocracyStats />;
  }

  return null;
}

export default function DelegationStatsPage() {
  return (
    <DelegationLayout>
      <PalletTabs shallow={false}>
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

export const getServerSideProps = withCommonProps(async (ctx) => {
  const { type } = ctx.query;
  const {
    modules: { referenda: hasReferenda },
  } = getChainSettings(process.env.CHAIN);
  const defaultType = hasReferenda ? Referenda : Democracy;

  const tracksProps = await fetchOpenGovTracksProps();

  if (type === Democracy || (!type && defaultType === Democracy)) {
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
      props: {
        delegatee: delegatee ?? EmptyList,
        delegators: delegators ?? EmptyList,
        democracySummary: democracySummary ?? {},
        ...tracksProps,
      },
    };
  } else if (type === Referenda || (!type && defaultType === Referenda)) {
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
      props: {
        tracksStats: tracksStats ?? [],
        delegatee: delegatee ?? EmptyList,
        tracksReferendaSummary: tracksReferendaSummary ?? [],
        ...tracksProps,
      },
    };
  } else {
    return {
      props: {
        ...tracksProps,
      },
    };
  }
});
