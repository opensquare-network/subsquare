import { usePost } from "next-common/context/post";
import Tooltip from "next-common/components/tooltip";
import { useContext } from "react";
import { ConfirmInfoContext } from "./confirmationInfo";
import { SystemInfo } from "@osn/icons/subsquare";

export default function ConfirmAttempts() {
  const { showConfirmAttempts } = useContext(ConfirmInfoContext);
  const post = usePost();

  if (!showConfirmAttempts) {
    return null;
  }

  const attempts = [];
  const timeline = post?.onchainData?.timeline || [];
  for (let i = 0; i < timeline.length; i++) {
    const curr = timeline[i];
    if (curr.name !== "ConfirmStarted") {
      continue;
    }
    const next = timeline[i + 1];
    if (["ConfirmAborted", "Confirmed"].includes(next?.name)) {
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
    <div className="flex flex-col">
      {attempts.map((item, index) => (
        <span key={index}>
          {(item.end || index !== 0) && (
            <span className="inline-block w-[18px]">
              {item.end && (item.success ? "✅" : "❌")}
            </span>
          )}
          {`#${
            index + 1
          }: ${item.start.indexer.blockHeight.toLocaleString()} ~ `}
          {item.end && `${item.end?.indexer.blockHeight.toLocaleString()}`}
        </span>
      ))}
    </div>
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
