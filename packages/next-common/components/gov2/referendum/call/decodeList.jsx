import { useState } from "react";
import { noop } from "@polkadot/util";

const separateNumber = 5;

export default function DecodeCallList({ list = [], renderItem = noop }) {
  const [showMore, setShowMore] = useState(false);
  const shouldCollapsed = list?.length > separateNumber;
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-y-2">
        {list
          .slice(0, separateNumber)
          .map((item, index) => renderItem(item, index))}
        {showMore &&
          shouldCollapsed &&
          list
            ?.slice(separateNumber)
            .map((item, index) => renderItem(item, separateNumber + index))}
      </div>
      {shouldCollapsed && (
        <div className="mt-4">
          <span
            role="button"
            className="text12Medium text-theme500"
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            Show {showMore ? "Less" : "More"}
          </span>
        </div>
      )}
    </div>
  );
}
