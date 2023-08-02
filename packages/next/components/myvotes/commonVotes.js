import MyVotesList from "./myVotesList";
import Summary from "./summary";

export default function CommonVotes({
  moduleTabIndex,
  setModuleTabIndex,
  isLoading,
  votes,
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <Summary
        votes={votes?.map((item) => item.vote)}
        moduleTabIndex={moduleTabIndex}
        setModuleTabIndex={setModuleTabIndex}
      />
      <MyVotesList
        isLoading={isLoading}
        votes={votes}
        moduleTabIndex={moduleTabIndex}
      />
    </div>
  );
}
