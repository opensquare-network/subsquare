import PageTabs from "next-common/components/pageTabs";
import { useChainSettings } from "next-common/context/chain";
import ResponsiveVotes from "./responsiveVotes";
import ResponsiveCalls from "./responsiveCalls";
import { VoteFilter, VoteFilterStateProvider } from "./voteFilter";

export default function ListTabs() {
  const { useVoteCall } = useChainSettings();

  return (
    <div className="ml-[24px]">
      <VoteFilterStateProvider>
        <PageTabs
          tabs={[
            {
              name: "All Votes",
              content: <ResponsiveVotes />,
              extra: <VoteFilter />,
            },
            useVoteCall
              ? {
                  name: "Calls",
                  content: <ResponsiveCalls />,
                }
              : null,
          ].filter(Boolean)}
        />
      </VoteFilterStateProvider>
    </div>
  );
}
