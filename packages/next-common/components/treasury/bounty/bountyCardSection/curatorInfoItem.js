import AddressUser from "next-common/components/user/addressUser";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import React from "react";
import { CuratorBadge } from "next-common/components/treasury/bounty/curator";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";

function CuratorInfoItem({
  badge,
  showBadge = true,
  signatories = [],
  curator,
}) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 121 : 196;

  if (!curator) {
    return null;
  }

  return (
    <span className="flex items-center flex-1 h-5">
      <AddressUser
        add={curator}
        className="text12Medium text-textPrimary flex items-center h-5"
        maxWidth={userMaxWidth}
      />

      {badge && showBadge && (
        <Tooltip
          className="pl-2"
          content={
            <AddressesTooltip
              className="gap-y-1 flex flex-col"
              addresses={signatories}
              addressMaxWidth={140}
            />
          }
        >
          <CuratorBadge className="h-5 flex items-center" badge={badge} />
        </Tooltip>
      )}
    </span>
  );
}
export default React.memo(CuratorInfoItem);
