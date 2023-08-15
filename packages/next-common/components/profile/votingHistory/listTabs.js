import PageTabs from "next-common/components/pageTabs";
import { useChainSettings } from "next-common/context/chain";
import ResponsiveVotes from "./responsiveVotes";
import ResponsiveCalls from "./responsiveCalls";

export default function ListTabs() {
  const { useVoteCall } = useChainSettings();

  return (
    <div className="ml-[24px]">
      <PageTabs
        tabs={[
          {
            name: "All Votes",
            content: <ResponsiveVotes />,
          },
          useVoteCall
            ? {
                name: "Calls",
                content: <ResponsiveCalls />,
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
}
