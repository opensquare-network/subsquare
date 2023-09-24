import { Title } from "./styled";
import ResponsiveVotes from "./responsiveVotes";

export default function MyVotesList({ votes, isLoading }) {
  return (
    <>
      <div className="flex gap-[8px]">
        <Title>On-chain Votes</Title>
        <span className="text-textTertiary">{votes?.length || 0}</span>
      </div>
      <ResponsiveVotes votes={votes} isLoading={isLoading} />
    </>
  );
}
