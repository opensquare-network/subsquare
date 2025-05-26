import SystemUser from "next-common/components/user/systemUser";
import AddressUser from "next-common/components/user/addressUser";
import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import React from "react";
import { CuratorBadge } from "next-common/components/treasury/bounty/curator";
import MultisigTooltip from "./multisigTooltip";

function CuratorInfoItem({ data, badge, showBadge = true, signatories = [] }) {
  const { sm } = useScreenSize();
  const userMaxWidth = sm ? 121 : 196;

  return (
    <span className="inline-block flex items-center flex-1 h-5">
      {data?.author ? (
        <SystemUser
          user={data?.author}
          className="text12Medium text-textPrimary flex items-center h-5"
          maxWidth={userMaxWidth}
        />
      ) : (
        <AddressUser
          add={data.address || data.proposer}
          className="text12Medium text-textPrimary flex items-center h-5"
          maxWidth={userMaxWidth}
        />
      )}

      {badge && showBadge && (
        <MultisigTooltip signatories={signatories}>
          <span className="pl-2 h-5 flex items-center">
            <CuratorBadge badge={badge} />
          </span>
        </MultisigTooltip>
      )}
    </span>
  );
}
export default React.memo(CuratorInfoItem);
