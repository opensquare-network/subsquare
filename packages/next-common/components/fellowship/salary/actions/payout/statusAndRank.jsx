import FellowshipRank from "next-common/components/fellowship/rank";
import Tooltip from "next-common/components/tooltip";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import useFellowshipMemberInfo from "next-common/components/fellowship/salary/actions/hooks/useFellowshipMemberInfo";
import { memo } from "react";

function StatusAndRank({ address }) {
  const chain = useChain();
  const isCollectives = isCollectivesChain(chain);
  const memberInfo = useFellowshipMemberInfo(address);
  if (!isCollectives || !memberInfo) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-4">
      <Tooltip content={memberInfo.isActive ? "Active" : "Inactive"}>
        <SignalIndicator
          className="w-[16px] h-[16px]"
          active={memberInfo.isActive}
        />
      </Tooltip>
      <FellowshipRank rank={memberInfo.rank || 0} />
    </div>
  );
}
export default memo(StatusAndRank);
