import { useMemo } from "react";
import AddressUser from "next-common/components/user/addressUser";
import { VOTE_TYPE_CONFIG } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/common";
import { cn } from "next-common/utils";
import FellowshipRank from "next-common/components/fellowship/rank";

export default function FellowshipTooltipContent({ formatData, rank }) {
  const { tally: votes, actionName, isAye, account } = formatData || {};

  const voteType = useMemo(() => {
    if (isAye) return "aye";
    if (isAye === false) return "nay";
    return null;
  }, [isAye]);

  const { color: voteColor, label: voteLabel } =
    VOTE_TYPE_CONFIG[voteType] ?? {};

  return (
    <div className="space-y-1 pointer-events-auto">
      {[
        {
          label: "Account",
          value: (
            <div className="flex items-center gap-x-2">
              <FellowshipRank rank={rank} />
              <AddressUser
                noTooltip={true}
                className="text12Medium text-textPrimaryContrast"
                add={account}
                size={12}
              />
            </div>
          ),
        },
        {
          label: "Action",
          value: `${actionName} (${voteLabel})`,
        },
        {
          label: "Tally Impact",
          value: votes ? (
            <div className={cn(voteColor, "inline-flex text12Medium")}>
              <span>
                {isAye ? "+" : "-"}
                {votes}
              </span>
            </div>
          ) : (
            <span className="text-textSecondaryContrast text12Medium">0</span>
          ),
        },
        {
          label: "Bare Aye Impact",
          value: (
            <span
              className={cn(
                isAye ? voteColor : "text-textSecondaryContrast",
                "text12Medium",
              )}
            >
              {isAye ? "+1" : "0"}
            </span>
          ),
        },
      ]
        .filter(Boolean)
        .map(({ label, value }) => (
          <div className="flex" key={label}>
            <div className="">{label} :</div>
            <div className="pl-1">{value}</div>
          </div>
        ))}
    </div>
  );
}
