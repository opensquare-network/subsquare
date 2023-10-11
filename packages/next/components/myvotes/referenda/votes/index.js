import { useSelector } from "react-redux";
import myReferendaVotesSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votes";
import ResponsiveReferendaVotes from "./responsive";
import { useState } from "react";
import { Title } from "../../styled";
import myFilteredReferendaPriorLocksSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/priors";
import PriorLocks from "./priors";
import WithAllVotesLink from "../../common/withAllVotesLink";
import VotesListTitle from "../../common/votesListTitle";

const tabs = Object.freeze({
  votes: 1,
  priors: 2,
});

function PriorLocksTitle({ disabled }) {
  const filteredLocks = useSelector(myFilteredReferendaPriorLocksSelector);

  return (
    <div className="flex gap-[8px]">
      <Title disabled={disabled}>Prior Locks</Title>
      <span className="text-textTertiary">{filteredLocks.length}</span>
    </div>
  );
}

export default function MyReferendaVotes() {
  const referendaVotes = useSelector(myReferendaVotesSelector);
  const [tab, setTab] = useState(tabs.votes);

  return (
    <>
      <WithAllVotesLink isReferenda={true}>
        <ol className="flex">
          <li className="cursor-pointer" onClick={() => setTab(tabs.votes)}>
            <VotesListTitle
              disabled={tab !== tabs.votes}
              length={referendaVotes?.length || 0}
            />
          </li>
          <li className="cursor-pointer" onClick={() => setTab(tabs.priors)}>
            <PriorLocksTitle disabled={tab !== tabs.priors} />
          </li>
        </ol>
      </WithAllVotesLink>
      {tab === tabs.votes ? <ResponsiveReferendaVotes /> : <PriorLocks />}
    </>
  );
}
