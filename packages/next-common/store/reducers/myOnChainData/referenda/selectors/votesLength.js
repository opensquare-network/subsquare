import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";

const referendaVotesLengthSelector = createSelector(
  myReferendaVotingSelector,
  (votingArr) => {
    return votingArr.reduce((result, voting) => {
      const { votes = [] } = voting;
      return result + votes.length;
    }, 0);
  },
);

export default referendaVotesLengthSelector;
