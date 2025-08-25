import { cn } from "next-common/utils";
import { VOTE_TYPE } from "next-common/utils/dv/voteType";

export default function VoteStatus({ status }) {
  let icon = null;
  if (status === VOTE_TYPE.NoVote) {
    icon = <span className="w-2 h-[2px] rounded-[2px] bg-neutral500"></span>;
  } else {
    icon = (
      <span
        className={cn("w-3 h-3 rounded-sm", {
          "bg-green300": status === VOTE_TYPE.Aye,
          "bg-red300": status === VOTE_TYPE.Nay,
          "bg-neutral500": status === VOTE_TYPE.Abstain,
        })}
      ></span>
    );
  }
  return (
    <span className="inline-flex w-5 h-5 justify-center items-center">
      {icon}
    </span>
  );
}
