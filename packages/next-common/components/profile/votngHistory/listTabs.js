import PageTabs from "next-common/components/pageTabs";
import OpenGovVotes from "./openGovVotes";
import OpenGovCalls from "./openGovCalls";
import DemocracyVotes from "./democracyVotes";
import DemocracyCalls from "./democracyCalls";
import { OpenGov } from "./moduleTab";

export default function ListTabs({ moduleTabIndex }) {
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
          {
            name: "Calls",
            content:
              moduleTabIndex === OpenGov ? (
                <OpenGovCalls />
              ) : (
                <DemocracyCalls />
              ),
          },
        ]}
      />
    </div>
  );
}
