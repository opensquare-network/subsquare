import ResponsiveVotes from "./responsiveVotes";
import VotesListTitle from "./common/votesListTitle";

export default function MyVotesList({ votes, isLoading }) {
  return (
    <>
      <VotesListTitle length={votes?.length || 0} />
      <ResponsiveVotes votes={votes} isLoading={isLoading} />
    </>
  );
}
