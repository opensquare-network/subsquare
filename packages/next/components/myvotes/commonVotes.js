import MyVotesList from "./myVotesList";
import Summary from "./summary";

export default function CommonVotes({ isLoading, votes, priors }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <Summary votes={votes} priors={priors} />
      <MyVotesList isLoading={isLoading} votes={votes} />
    </div>
  );
}
