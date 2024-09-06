import { usePost } from "next-common/context/post";
import Tooltip from "next-common/components/tooltip";
import { SystemInfo } from "@osn/icons/subsquare";
import { gov2State } from "next-common/utils/consts/state";
import TimeDuration from "next-common/components/TimeDuration";

function AttemptsLastTimeDuration({ start, end }) {
  if (!start || !end) {
    return null;
  }

  const blocks = end - start;
  return (
    <span>
      ,&nbsp;
      <TimeDuration blocks={blocks} showMonths={false} />
    </span>
  );
}

export default function ConfirmAttempts() {
  const post = usePost();

  const attempts = [];
  const timeline = post?.onchainData?.timeline || [];
  for (let i = 0; i < timeline.length; i++) {
    const curr = timeline[i];
    if (curr.name !== "ConfirmStarted") {
      continue;
    }
    const next = timeline[i + 1];
    if (
      ["ConfirmAborted", "Confirmed", gov2State.Rejected].includes(next?.name)
    ) {
      attempts.push({
        start: curr,
        end: next,
        success: next.name === "Confirmed",
      });
      continue;
    }
    attempts.push({
      start: curr,
      end: null,
    });
  }

  const tooltipContent = (
    <ol>
      {attempts.map((item) => {
        const { start, end, success } = item;
        const blockStart = start.indexer.blockHeight;
        const blockEnd = end?.indexer?.blockHeight;

        return (
          <li key={blockStart}>
            {(end || blockStart !== attempts[0].start.indexer.blockHeight) && (
              <span className="inline-block w-[18px]">
                {end && (success ? "✅" : "❌")}
              </span>
            )}
            {`#${
              attempts.indexOf(item) + 1
            }: ${blockStart.toLocaleString()} ~ `}
            {blockEnd && blockEnd.toLocaleString()}
            <AttemptsLastTimeDuration start={blockStart} end={blockEnd} />
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="flex justify-between">
      <span>Attempts</span>
      <div className="flex items-center gap-[4px]">
        <span>{attempts?.length || 0}</span>
        {attempts?.length > 0 && (
          <Tooltip
            content={tooltipContent}
            icon={<SystemInfo width={16} height={16} />}
          />
        )}
      </div>
    </div>
  );
}
