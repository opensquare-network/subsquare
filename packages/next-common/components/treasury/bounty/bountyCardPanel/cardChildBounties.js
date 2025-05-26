import React, { useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemMenu } from "@osn/icons/subsquare";
import BountyDetailPopup from "./bountyDetailPopup";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";

function CardChildBounties({
  childBounties,
  bountyIndex,
  item,
  isChildBountiesLoading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  if (isNil(childBounties) || isNil(bountyIndex) || isNil(item)) return null;
  const total = childBounties?.total ?? 0;
  const disabled = total === 0;

  return (
    <span className="mt-4 flex items-center">
      <span className="flex-1 py-[6px] px-3 bg-neutral200 text-textTertiary text12Medium flex items-center">
        <span>Child Bounties</span>&nbsp;
        <LoadableContent isLoading={isChildBountiesLoading}>
          <span className="text12Medium text-textSecondary">{total}</span>
        </LoadableContent>
      </span>
      <SecondaryButton
        disabled={disabled}
        size="small"
        className="ml-2 p-[6px] w-7"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <SystemMenu
          className={`w-4 h-4 ${
            disabled
              ? "[&_path]:fill-textTertiary"
              : "[&_path]:fill-textPrimary"
          } `}
        />
      </SecondaryButton>
      {isOpen && (
        <BountyDetailPopup
          childBounties={childBounties}
          bountyIndex={bountyIndex}
          item={item}
          onClose={() => setIsOpen(false)}
        />
      )}
    </span>
  );
}

export default React.memo(CardChildBounties);
