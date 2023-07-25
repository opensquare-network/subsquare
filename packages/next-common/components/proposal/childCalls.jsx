import { useState } from "react";
import { BaseTag } from "../tags/state/styled";

const seperateNumber = 5;

export default function ProposalChildCalls({ calls = [] }) {
  const [viewAll, setViewAll] = useState(false);
  const isLarge = calls.length > seperateNumber;

  return (
    <div>
      <div className="mt-2 border-l border-dashed border-neutral500 pl-4 space-y-2">
        {calls.slice(0, seperateNumber).map((call, idx) => (
          <ChildPair key={idx} call={call} />
        ))}

        {viewAll &&
          isLarge &&
          calls
            .slice(seperateNumber)
            .map((call, idx) => <ChildPair key={idx} call={call} />)}
      </div>

      {isLarge && (
        <div className="mt-4">
          <span
            role="button"
            className="text-theme500 text14Medium"
            onClick={() => {
              setViewAll(!viewAll);
            }}
          >
            {viewAll ? "Hide" : "View All"}
          </span>
        </div>
      )}
    </div>
  );
}

function ChildPair({ call = {} }) {
  return (
    <div className="flex gap-x-1">
      <BaseTag className="bg-neutral200 !text-textPrimary">
        {call.section}
      </BaseTag>
      <BaseTag className="bg-neutral200 !text-textPrimary">
        {call.method}
      </BaseTag>
    </div>
  );
}
