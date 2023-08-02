import MyVotesList from "./myVotesList";
import Summary from "./summary";

export default function MyVotes({ isLoading, votes }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <Summary votes={votes.map((item) => item.vote)} />
      <MyVotesList isLoading={isLoading} votes={votes} />
    </div>
  );
}
