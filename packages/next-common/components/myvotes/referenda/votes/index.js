import { useSelector } from "react-redux";
import myReferendaVotesSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votes";
import ResponsiveReferendaVotes from "./responsive";
import { useState } from "react";
import { Title } from "../../styled";
import { useMyFilteredReferendaPriorLocks } from "next-common/store/reducers/myOnChainData/referenda/selectors/priors";
import PriorLocks from "./priors";
import WithAllVotesLink from "../../common/withAllVotesLink";
import VotesListTitle from "../../common/votesListTitle";
import TabsList from "next-common/components/tabs/list";

const tabs = Object.freeze({
  votes: 1,
  priors: 2,
});

function PriorLocksTitle({ disabled }) {
  const filteredLocks = useMyFilteredReferendaPriorLocks();

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
  const [activeTabValue, setActiveTabValue] = useState(tabs.votes);

  const tabsListItems = [
    {
      value: tabs.votes,
      label() {
        return (
          <VotesListTitle
            disabled={activeTabValue !== tabs.votes}
            length={referendaVotes?.length || 0}
          />
        );
      },
    },
    {
      value: tabs.priors,
      label() {
        return <PriorLocksTitle disabled={activeTabValue !== tabs.priors} />;
      },
    },
  ];

  return (
    <>
      <WithAllVotesLink isReferenda={true}>
        <TabsList
          tabs={tabsListItems}
          activeTabValue={activeTabValue}
          onTabClick={(item) => {
            setActiveTabValue(item.value);
          }}
        />
      </WithAllVotesLink>

      {activeTabValue === tabs.votes ? (
        <ResponsiveReferendaVotes />
      ) : (
        <PriorLocks />
      )}
    </>
  );
}
