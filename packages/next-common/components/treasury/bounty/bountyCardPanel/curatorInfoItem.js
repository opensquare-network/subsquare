import SystemUser from "next-common/components/user/systemUser";
import AddressUser from "next-common/components/user/addressUser";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import React from "react";
import { CuratorBadge } from "next-common/components/treasury/bounty/curator";
import MultisigTooltip from "./multisigTooltip";

function CuratorInfoItem({ data, badge, showBadge = true }) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 160 : 240;
  if (!data) return null;
  if (data?.author) {
    return (
      <span className="flex">
        <SystemUser
          user={data?.author}
          className="text12Medium text-textPrimary"
          maxWidth={userMaxWidth}
        />
        {badge && showBadge && (
          <MultisigTooltip>
            <span className="ml-2">
              <CuratorBadge badge={badge} />
            </span>
          </MultisigTooltip>
        )}
      </span>
    );
  }

  return (
    <span className="flex items-center">
      <AddressUser
        add={data.address || data.proposer}
        className="text12Medium text-textPrimary"
        maxWidth={userMaxWidth}
      />
      {badge && (
        <span className="ml-2">
          <CuratorBadge badge={badge} />
        </span>
      )}
    </span>
  );
}
export default React.memo(CuratorInfoItem);
