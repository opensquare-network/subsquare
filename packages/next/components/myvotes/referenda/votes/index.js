import { useSelector } from "react-redux";
import myReferendaVotesSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votes";
import ResponsiveReferendaVotes from "./responsive";
import { useState } from "react";
import { Title } from "../../styled";
import myFilteredReferendaPriorLocksSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/priors";
import PriorLocks from "./priors";
import WithAllVotesLink from "../../common/withAllVotesLink";
import VotesListTitle from "../../common/votesListTitle";
import TabsList from "next-common/components/tabsList";

const tabs = Object.freeze({
  votes: 1,
  priors: 2,
});

function PriorLocksTitle({ disabled }) {
  const filteredLocks = useSelector(myFilteredReferendaPriorLocksSelector);

  return (
    <div className="flex gap-[8px]" role="button">
      <Title disabled={disabled}>Prior Locks</Title>
      <span className="text-textTertiary text16Medium">
        {filteredLocks.length}
      </span>
    </div>
  );
}

export default function MyReferendaVotes() {
  const referendaVotes = useSelector(myReferendaVotesSelector);
  const [activeTabId, setActiveTabId] = useState(tabs.votes);

  const tabsListItems = [
    {
      id: tabs.votes,
      label: "On-chain Votes",
      render() {
        return (
          <VotesListTitle
            disabled={activeTabId !== tabs.votes}
            length={referendaVotes?.length || 0}
          />
        );
      },
    },
    {
      id: tabs.priors,
      label: "Prior Locks",
      render() {
        return <PriorLocksTitle disabled={activeTabId !== tabs.priors} />;
      },
    },
  ];

  return (
    <>
      <WithAllVotesLink isReferenda={true}>
        <TabsList
          tabs={tabsListItems}
          onTabClick={(item) => setActiveTabId(item.id)}
        />
      </WithAllVotesLink>

      {activeTabId === tabs.votes ? (
        <ResponsiveReferendaVotes />
      ) : (
        <PriorLocks />
      )}
    </>
  );
}
