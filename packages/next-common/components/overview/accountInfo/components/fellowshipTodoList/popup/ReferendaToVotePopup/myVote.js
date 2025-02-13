import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";

export default function MyVote({ vote }) {
  const isAye = vote.vote.isAye;
  const votes = isAye ? vote.vote.asAye.toNumber() : vote.vote.asNay.toNumber();
  return (
    <div className="flex items-center gap-[8px]">
      {isAye ? (
        <SystemVoteAye className="w-[16px] h-[16px]" />
      ) : (
        <SystemVoteNay className="w-[16px] h-[16px]" />
      )}
      <span className="text14Medium">
        {isAye ? "Aye" : "Nay"}
        <span className="text-textTertiary">({votes})</span>
      </span>
    </div>
  );
}
