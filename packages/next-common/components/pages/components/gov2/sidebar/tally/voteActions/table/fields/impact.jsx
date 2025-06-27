import { useChainSettings } from "next-common/context/chain";
import {
  VOTE_TYPE_CONFIG,
  absBigInt,
  getImpactVotes,
  getSupportImpactVotes,
} from "../../common";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";

function NoImpact() {
  const { symbol } = useChainSettings();

  return (
    <span className="text-textTertiary text14Medium">
      <span className="text-textPrimary text14Medium">0</span>
      &nbsp;
      <span>{symbol}</span>
    </span>
  );
}

function ImpactVotesDisplay({ data, type, isSupport = false }) {
  const { decimals, symbol } = useChainSettings();
  const impactVotes = isSupport
    ? getSupportImpactVotes(data, type)
    : getImpactVotes(data, type);

  if (isNil(impactVotes) || BigInt(impactVotes) === BigInt(0)) {
    return <NoImpact />;
  }

  const isAye = impactVotes >= 0;
  const { color } = VOTE_TYPE_CONFIG[isAye ? "aye" : "nay"];

  return (
    <>
      <div className={cn(color, "inline-flex")}>
        {isAye ? "+" : "-"}
        <ValueDisplay
          value={toPrecision(absBigInt(impactVotes), decimals)}
          symbol={symbol}
        />
      </div>
    </>
  );
}

function TallyVotesDisplay({ data, type }) {
  return (
    <div>
      <span>Tally: </span>
      <ImpactVotesDisplay data={data} type={type} />
    </div>
  );
}

function SupportVotesDisplay({ data, type }) {
  return (
    <div>
      <span>Support: </span>
      <ImpactVotesDisplay data={data} type={type} isSupport={true} />
    </div>
  );
}

export default function ImpactVotesField({ data, type }) {
  return (
    <div className="text-textTertiary text14Medium max-md:flex max-md:flex-col max-md:items-end">
      <TallyVotesDisplay data={data} type={type} />
      <SupportVotesDisplay data={data} type={type} />
    </div>
  );
}
