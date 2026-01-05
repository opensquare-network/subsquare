import Tooltip from "next-common/components/tooltip";
import Chains from "next-common/utils/consts/chains";
import { isNil } from "lodash-es";
import { getChainSettingsPolyfill } from "next-common/utils/consts/settingsPolyfill";
import ChainIcon from "next-common/components/header/chainIcon";

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
  const chains = {
    1000: Chains.polkadotAssetHub,
    1001: Chains.collectives,
    1002: Chains.polkadotBridge,
    1004: Chains.polkadotPeople,
    1005: Chains.polkadotCoretime,
  };

  if (isNil(taskId)) {
    return "-";
  } else if (!chains[taskId]) {
    return taskId;
  }
  const chain = chains[taskId];
  return <ChainInfo chain={chain} />;
}

function ChainInfo({ chain }) {
  const { name } = getChainSettingsPolyfill(chain);
  return (
    <div className="flex items-center gap-x-1">
      <ChainIcon chain={chain} />{" "}
      <span className="text-textPrimary">{name}</span>
    </div>
  );
}
