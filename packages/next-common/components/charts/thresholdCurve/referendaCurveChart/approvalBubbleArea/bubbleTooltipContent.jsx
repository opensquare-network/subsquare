import { useMemo } from "react";
import AddressUser from "next-common/components/user/addressUser";
import { getActionName } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table/fields/action";
import { NoImpact } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table/fields/impact";
import { useChainSettings } from "next-common/context/chain";
import {
  VOTE_TYPE_CONFIG,
  absBigInt,
  getImpactVotes,
} from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/common";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { cn } from "next-common/utils";

export default function TooltipContent({ who, data, type }) {
  const actionType = useMemo(() => getActionType(data), [data]);
  return (
    <div className="space-y-1 pointer-events-auto">
      {[
        {
          label: "Address",
          value: (
            <AddressUser
              noTooltip={true}
              className="text12Medium text-textPrimaryContrast"
              add={who}
              size={12}
            />
          ),
        },
        {
          label: "Action",
          value: `${getActionName(
            type,
            data?.preVote,
            data?.preDelegation,
          )} (${actionType})`,
        },
        {
          label: "Tally Impact",
          value: <TallyVotesDisplay data={data} type={type} />,
        },
      ].map(({ label, value }) => (
        <div className="flex" key={label}>
          <div className="">{label} :</div>
          <div className="pl-1">{value}</div>
        </div>
      ))}
    </div>
  );
}

const getActionType = (data) => {
  return data.vote.isSplitAbstain
    ? "Abstain"
    : data.vote.isSplit
    ? "Split"
    : data.vote?.vote?.vote?.isAye
    ? "Aye"
    : "Nay";
};

function TallyVotesDisplay({ data, type }) {
  const { decimals, symbol } = useChainSettings();
  const impactVotes = getImpactVotes(data, type);

  if (isNil(impactVotes) || BigInt(impactVotes) === BigInt(0)) {
    return (
      <NoImpact
        valueClassName="text-textSecondaryContrast"
        className="text12Medium text-textSecondaryContrast"
      />
    );
  }
  const isAye = impactVotes >= 0;
  const { color } = VOTE_TYPE_CONFIG[isAye ? "aye" : "nay"];
  return (
    <div className={cn(color, "inline-flex text12Medium")}>
      {isAye ? "+" : "-"}
      <ValueDisplay
        value={toPrecision(absBigInt(impactVotes), decimals)}
        symbol={symbol}
      />
    </div>
  );
}
