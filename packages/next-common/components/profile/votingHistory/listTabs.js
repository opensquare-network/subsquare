import PageTabs from "next-common/components/pageTabs";
import OpenGovVotes from "./openGovVotes";
import OpenGovCalls from "./openGovCalls";
import DemocracyVotes from "./democracyVotes";
import DemocracyCalls from "./democracyCalls";
import { OpenGov } from "./common";
import { useChainSettings } from "next-common/context/chain";

export default function ListTabs({ moduleTabIndex }) {
  const { useVoteCall } = useChainSettings();

  return (
    <div className="ml-[24px]">
      <PageTabs
        tabs={[
          {
            name: "All Votes",
            content:
              moduleTabIndex === OpenGov ? (
                <OpenGovVotes />
              ) : (
                <DemocracyVotes />
              ),
          },
          useVoteCall
            ? {
                name: "Calls",
                content:
                  moduleTabIndex === OpenGov ? (
                    <OpenGovCalls />
                  ) : (
                    <DemocracyCalls />
                  ),
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
}
