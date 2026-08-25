import Tooltip from "next-common/components/tooltip";
import { isNil } from "lodash-es";
import ChainInfo from "next-common/components/chain/info";
import { useChain } from "next-common/context/chain";
import { getParachainChains } from "next-common/utils/xcm/parachains";

export default function TaskColumn({ item }) {
  let content;
  if (item.isTask) {
    content = <TaskContent taskId={item.taskId} />;
  } else if (item.isPool) {
    content = (
      <Tooltip content="Shared coretime pool">
        <span className="text-textTertiary">Pool</span>
      </Tooltip>
    );
  } else if (item.isIdle) {
    content = <span className="text-textTertiary">Idle</span>;
  } else {
    content = <span className="text-textTertiary">-</span>;
  }
  return <div>{content}</div>;
}

function TaskContent({ taskId }) {
  const activeChain = useChain();
  const chains = getParachainChains(activeChain);

  if (isNil(taskId)) {
    return "-";
  } else if (!chains?.[taskId]) {
    return taskId;
  }
  const chain = chains[taskId];
  return <ChainInfo chain={chain} />;
}
