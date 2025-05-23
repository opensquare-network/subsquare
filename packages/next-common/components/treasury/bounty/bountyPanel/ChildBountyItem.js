import React from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemMenu } from "@osn/icons/subsquare";

function ChildBountyItem() {
  return (
    <span className="mt-4 flex items-center">
      <span className="flex-1 py-[6px] px-3 bg-neutral200 text-textTertiary text12Medium">
        Child Bounties 6
      </span>
      <SecondaryButton size="small" className="ml-2 p-[6px]" onClick={() => {}}>
        <SystemMenu className="w-4 h-4 [&_path]:fill-textSecondary" />
      </SecondaryButton>
    </span>
  );
}

export default React.memo(ChildBountyItem);
