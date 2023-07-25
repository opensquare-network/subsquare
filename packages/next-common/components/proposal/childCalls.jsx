import { useState } from "react";
import { BaseTag } from "../tags/state/styled";

const seperateNumber = 5;

export default function ProposalChildCalls({ pairs = [] }) {
  const [viewAll, setViewAll] = useState(false);
  const isLarge = pairs.length > seperateNumber;

  return (
    <div>
      <div className="mt-2 border-l border-dashed border-neutral500 pl-4 space-y-2">
        {pairs.slice(0, seperateNumber).map((callPair, idx) => (
          <ChildPair key={idx} pair={callPair} />
        ))}

        {viewAll &&
          isLarge &&
          pairs
            .slice(seperateNumber)
            .map((callPair, idx) => <ChildPair key={idx} pair={callPair} />)}
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

function ChildPair({ pair = [] }) {
  return (
    <div className="flex gap-x-1">
      {pair.map((call, idx) => (
        <BaseTag key={idx} className="bg-neutral200 !text-textPrimary">
          {call}
        </BaseTag>
      ))}
    </div>
  );
}
