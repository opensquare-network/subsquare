import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import DelegationLayout from "next-common/components/delegation/layout";
import ReferendaStats from "next-common/components/delegation/stats/referendaStats";
import { ssrNextApi } from "next-common/services/nextApi";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import {
  Democracy,
  ModuleTab,
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { useChainSettings } from "next-common/context/chain";

export default function DelegationStatsPage() {
  const { hasReferenda, noDemocracy } = useChainSettings();

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: "OpenGov" });
  }
  if (!noDemocracy) {
    availableTabs.push({ tabId: Democracy, tabTitle: Democracy });
  }

  const defaultTab = availableTabs[0]?.tabId;

  return (
    <DelegationLayout>
      <ModuleTabProvider availableTabs={availableTabs} defaultTab={defaultTab}>
        <div className="flex flex-col gap-[18px]">
          <div className="flex justify-between mx-[24px] max-sm:flex-col gap-[12px]">
            <span className="text16Bold text-textPrimary">
              Delegation Statistics
            </span>
            <ModuleTab />
          </div>
          <ReferendaStats />
        </div>
      </ModuleTabProvider>
    </DelegationLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [
    { result: tracksStats },
    { result: delegatee },
    { result: tracksReferendaSummary },
    { result: gov2ReferendaSummary },
    tracksProps,
  ] = await Promise.all([
    ssrNextApi.fetch("referenda/tracks"),
    ssrNextApi.fetch("referenda/delegatee", {
      sort: JSON.stringify(["votes", "desc"]),
      pageSize: 25,
    }),
    ssrNextApi.fetch("referenda/summary"),
    ssrNextApi.fetch(gov2ReferendumsSummaryApi),
    fetchOpenGovTracksProps(),
  ]);

  return {
    props: {
      tracksStats: tracksStats ?? [],
      delegatee: delegatee ?? EmptyList,
      tracksReferendaSummary: tracksReferendaSummary ?? [],
      gov2ReferendaSummary: gov2ReferendaSummary ?? {},
      ...tracksProps,
    },
  };
});
