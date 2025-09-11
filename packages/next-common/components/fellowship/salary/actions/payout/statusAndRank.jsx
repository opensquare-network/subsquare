import FellowshipRank from "next-common/components/fellowship/rank";
import Tooltip from "next-common/components/tooltip";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import useFellowshipMemberInfo from "next-common/components/fellowship/salary/actions/hooks/useFellowshipMemberInfo";
import { memo } from "react";
import { isNil } from "lodash-es";

function StatusAndRank({ address }) {
  const memberInfo = useFellowshipMemberInfo(address);
  if (!memberInfo) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-4">
      {!isNil(memberInfo?.isActive) && (
        <Tooltip content={memberInfo?.isActive ? "Active" : "Inactive"}>
          <SignalIndicator
            className="w-[16px] h-[16px]"
            active={memberInfo.isActive}
          />
        </Tooltip>
      )}
      {!isNil(memberInfo?.rank) && <FellowshipRank rank={memberInfo.rank} />}
    </div>
  );
}

export default memo(StatusAndRank);
