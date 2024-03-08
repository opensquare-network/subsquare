import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { flatten } from "lodash-es";
import orderBy from "lodash.orderby";

const myReferendaVotesSelector = createSelector(
  myReferendaVotingSelector,
  (votingArr) => {
    const votesArr = votingArr.map((voting) => {
      return [...(voting.votes || []), ...(voting.delegatedVotes || [])];
    });
    return orderBy(flatten(votesArr), ["referendumIndex"], ["desc"]);
  },
);

export default myReferendaVotesSelector;
