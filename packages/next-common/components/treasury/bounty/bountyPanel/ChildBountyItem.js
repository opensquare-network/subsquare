import React from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemMenu } from "@osn/icons/subsquare";

function ChildBountyItem({ childBounties }) {
  const total = childBounties?.total ?? 0;
  const disabled = total === 0;
  return (
    <span className="mt-4 flex items-center">
      <span className="flex-1 py-[6px] px-3 bg-neutral200 text-textTertiary text12Medium">
        Child Bounties {total}
      </span>
      <SecondaryButton
        disabled={disabled}
        size="small"
        className="ml-2 p-[6px]"
        onClick={() => {}}
      >
        <SystemMenu
          className={`w-4 h-4 ${
            disabled
              ? "[&_path]:fill-textTertiary"
              : "[&_path]:fill-textPrimary"
          } `}
        />
      </SecondaryButton>
    </span>
  );
}

export default React.memo(ChildBountyItem);
