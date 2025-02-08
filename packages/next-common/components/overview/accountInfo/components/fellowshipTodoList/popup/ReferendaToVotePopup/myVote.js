import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export default function MyVote({ vote }) {
  const { myRank } = usePopupParams();
  const isAye = vote.vote.isAye;
  return (
    <div className="flex items-center gap-[8px]">
      {isAye ? (
        <SystemVoteAye className="w-[16px] h-[16px]" />
      ) : (
        <SystemVoteNay className="w-[16px] h-[16px]" />
      )}
      <span className="text14Medium">
        {isAye ? "Aye" : "Nay"}
        <span className="text-textTertiary">({myRank})</span>
      </span>
    </div>
  );
}
