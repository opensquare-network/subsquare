import PageTabs from "next-common/components/pageTabs";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import styled from "styled-components";
import OpenGovVotes from "./openGovVotes";
import OpenGovCalls from "./openGovCalls";
import DemocracyVotes from "./democracyVotes";
import DemocracyCalls from "./democracyCalls";
import { OpenGov } from "./moduleTab";

const ListCard = styled(SecondaryCard)`
  margin-left: -24px;
`;

export default function ListTabs({ moduleTabIndex }) {
  return (
    <div className="ml-[24px]">
      <PageTabs
        tabs={[
          {
            name: "All Votes",
            content: (
              <ListCard>
                {moduleTabIndex === OpenGov ? (
                  <OpenGovVotes />
                ) : (
                  <DemocracyVotes />
                )}
              </ListCard>
            ),
          },
          {
            name: "Calls",
            content: (
              <ListCard>
                {moduleTabIndex === OpenGov ? (
                  <OpenGovCalls />
                ) : (
                  <DemocracyCalls />
                )}
              </ListCard>
            ),
          },
        ]}
      />
    </div>
  );
}
