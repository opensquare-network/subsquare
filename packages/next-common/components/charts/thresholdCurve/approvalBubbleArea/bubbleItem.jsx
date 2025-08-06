import { useMemo } from "react";
import Tooltip from "next-common/components/tooltip";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import AddressUser from "next-common/components/user/addressUser";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
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
const sideLength = 16;

export default function BubbleItem({
  leftPositionPercent,
  bottomPositionPercent,
  type,
  who,
  data,
}) {
  const style = useMemo(() => {
    return {
      left: `calc(${leftPositionPercent} - ${sideLength / 2}px)`,
      bottom: `calc(${bottomPositionPercent} - ${sideLength / 2}px)`,
      width: `${sideLength}px`,
      height: `${sideLength}px`,
    };
  }, [bottomPositionPercent, leftPositionPercent]);
  const [avatar] = useAvatarInfo(who);

  return (
    <div
      style={style}
      className="absolute flex bg-red-200 rounded-full pointer-events-auto cursor-pointer overflow-hidden hover:scale-110 hover:z-10"
    >
      <Tooltip
        className={"inline-flex"}
        content={
          <div>
            <div className="space-y-1">
              <h1 className="text14Bold pb-1">
                {getActionName(type, data?.preVote, data?.preDelegation)}
              </h1>
              <AddressUser
                className="text14Medium text-textPrimaryContrast"
                add={who}
                size={12}
              />
              <TallyVotesDisplay data={data} type={type} />
            </div>
          </div>
        }
      >
        <AvatarDisplay address={who} avatarCid={avatar} size={sideLength} />
      </Tooltip>
    </div>
  );
}

function TallyVotesDisplay({ data, type }) {
  const { decimals, symbol } = useChainSettings();
  const impactVotes = getImpactVotes(data, type);

  const displayValue = useMemo(() => {
    if (isNil(impactVotes) || BigInt(impactVotes) === BigInt(0)) {
      return (
        <NoImpact valueClassName="text-textTertiary" className="text12Medium" />
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
  }, [decimals, impactVotes, symbol]);

  return (
    <div>
      <span>Tally: </span>
      {displayValue}
    </div>
  );
}
