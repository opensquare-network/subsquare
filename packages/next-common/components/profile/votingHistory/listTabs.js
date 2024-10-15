import PageTabs from "next-common/components/pageTabs";
import { useChainSettings } from "next-common/context/chain";
import ResponsiveVotes from "./responsiveVotes";
import ResponsiveCalls from "./responsiveCalls";
import { VoteFilter } from "./voteFilter";
import { DropdownFilterProvider } from "next-common/components/dropdownFilter";

export default function ListTabs() {
  const { useVoteCall } = useChainSettings();

  return (
    <div className="ml-[24px]">
      <DropdownFilterProvider>
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
      </DropdownFilterProvider>
    </div>
  );
}
