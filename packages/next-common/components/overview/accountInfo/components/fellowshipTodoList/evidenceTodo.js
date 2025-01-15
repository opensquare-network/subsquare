import useMemberData from "../../hook/useMemberData";
import { useDemotionPeriodCheck } from "../collectivesDemotionPrompt";
import TodoTag from "./todoTag";
import { useCollectivesApi } from "next-common/context/collectives/api";

function DemotionExpiringTodo({ collectiveMember, coreMember, coreParams }) {
  const { isDemotionExpiring } = useDemotionPeriodCheck({
    lastProof: coreMember?.lastProof,
    rank: collectiveMember?.rank,
    params: coreParams,
  });

  if (!isDemotionExpiring) {
    return null;
  }

  return (
    <div className="flex items-center">
      <TodoTag>Membership</TodoTag>
      <div className="text-textPrimary text14Medium">
        Your demotion period of membership is closing. Submit your evidence for
        retention
      </div>
    </div>
  );
}

export default function EvidenceTodo() {
  const collectivesApi = useCollectivesApi();
  const { data, isLoading } = useMemberData("fellowship", collectivesApi);
  if (isLoading) {
    return null;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return null;
  }

  return (
    <DemotionExpiringTodo
      collectiveMember={collectiveMember}
      coreMember={coreMember}
      coreParams={coreParams}
    />
  );
}
