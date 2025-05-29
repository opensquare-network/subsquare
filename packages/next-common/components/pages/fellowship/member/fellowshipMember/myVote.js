import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSubFellowshipVote } from "next-common/utils/hooks/fellowship/useFellowshipVote";

export default function MyVote({ referendumIndex }) {
  const realAddress = useRealAddress();
  const { result: myVote } = useSubFellowshipVote(referendumIndex, realAddress);
  const vote = myVote?.toJSON();

  if (!vote) {
    return null;
  }

  return (
    <div className="flex gap-[8px] text12Medium">
      <div className="flex gap-[4px]">
        <span className="text-textSecondary">My Vote</span>
        {"aye" in vote ? (
          <span className="text-green500">Aye</span>
        ) : (
          <span className="text-red500">Nay</span>
        )}
      </div>
      <div className="text-textTertiary">·</div>
      <div className="flex gap-[4px]">
        <span className="text-textSecondary">Votes</span>
        <span className="text-textPrimary">
          {"aye" in vote ? vote.aye : vote.nay}
        </span>
      </div>
    </div>
  );
}
