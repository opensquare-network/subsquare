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
import Progress from "next-common/components/progress";

export function NoImpact({ className = "", valueClassName }) {
  const { symbol } = useChainSettings();

  return (
    <span className={cn("text-textTertiary text14Medium", className)}>
      <span className={cn("text-textPrimary", valueClassName)}>0</span>
      &nbsp;
      <span>{symbol}</span>
    </span>
  );
}

function ImpactVotesDisplay({
  data,
  type,
  isSupport = false,
  valueClassName = "",
}) {
  const { decimals, symbol } = useChainSettings();
  const impactVotes = isSupport
    ? getSupportImpactVotes(data, type)
    : getImpactVotes(data, type);

  if (isNil(impactVotes) || BigInt(impactVotes) === BigInt(0)) {
    return <NoImpact valueClassName={valueClassName} />;
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
          className={valueClassName}
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
      <span className="text12Medium">Support: </span>
      <ImpactVotesDisplay
        data={data}
        type={type}
        isSupport={true}
        valueClassName="text12Medium"
      />
    </div>
  );
}

export function ProgressDisplay({ impactVotes, maxImpactVotes }) {
  if (
    isNil(impactVotes) ||
    BigInt(impactVotes) === BigInt(0) ||
    !maxImpactVotes ||
    BigInt(maxImpactVotes) === BigInt(0)
  ) {
    return null;
  }

  const absImpactVotes = absBigInt(impactVotes);
  const percentage = Number((absImpactVotes * BigInt(100)) / maxImpactVotes);
  const isAye = impactVotes >= 0;

  return (
    <Progress
      className="mb-2 h-1 w-full"
      bg="var(--neutral100)"
      fg={isAye ? "var(--green300)" : "var(--red300)"}
      minWidth="2"
      rounded={false}
      alignRight={true}
      percentage={percentage}
    />
  );
}

function ImpactVotesProgressDisplay({ data, type, maxImpactVotes }) {
  const impactVotes = getImpactVotes(data, type);
  return (
    <ProgressDisplay
      impactVotes={impactVotes}
      maxImpactVotes={maxImpactVotes}
    />
  );
}

export default function ImpactVotesField({ data, type, maxImpactVotes }) {
  return (
    <div className="text-textTertiary text14Medium max-md:flex max-md:flex-col max-md:items-end">
      <ImpactVotesProgressDisplay
        data={data}
        type={type}
        maxImpactVotes={maxImpactVotes}
      />
      <TallyVotesDisplay data={data} type={type} />
      <SupportVotesDisplay data={data} type={type} />
    </div>
  );
}
