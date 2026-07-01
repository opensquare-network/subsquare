"use client";

import { useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { attemptColumns } from "next-common/components/recovery/common/columns";
import { isSameAddress, estimateBlocksTime } from "next-common/utils";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import useRelayChainBlockNumber from "next-common/hooks/useRelayChainBlockNumber";
import CancelAttemptDialog from "../cancelAttemptDialog";
import ApproveAttemptDialog from "../approveAttemptDialog";
import FinishAttemptDialog from "../finishAttemptDialog";

function CancelButton({
  lostAccount,
  friendGroupIndex,
  lastApprovalBlock,
  cancelDelay,
  onCancel,
}) {
  const [showDialog, setShowDialog] = useState(false);
  const currentBlock = useRelayChainBlockNumber();
  const { blockTime } = useChainSettings();

  const cancelableAt = lastApprovalBlock + (cancelDelay || 0);
  const canCancel = !isNil(currentBlock) && currentBlock >= cancelableAt;

  if (!canCancel) {
    let tooltip;
    if (isNil(currentBlock)) {
      tooltip = "Loading block number...";
    } else {
      const blocksRemaining = Math.max(0, cancelableAt - currentBlock);
      const estimatedTime = estimateBlocksTime(blocksRemaining, blockTime);
      tooltip = `Cancel available at block #${cancelableAt} (in ${estimatedTime})`;
    }
    return (
      <Tooltip content={tooltip}>
        <span className="text14Medium text-textTertiary cursor-not-allowed">
          Cancel
        </span>
      </Tooltip>
    );
  }

  return (
    <>
      {showDialog && (
        <CancelAttemptDialog
          onClose={() => setShowDialog(false)}
          lostAccount={lostAccount}
          friendGroupIndex={friendGroupIndex}
          onInBlock={onCancel}
        />
      )}
      <Tooltip content="Cancel the recovery attempt">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Cancel
        </button>
      </Tooltip>
    </>
  );
}

function ApproveButton({
  lostAccount,
  friendGroupIndex,
  onApprove,
  alreadyApproved,
}) {
  const [showDialog, setShowDialog] = useState(false);

  if (alreadyApproved) {
    return (
      <Tooltip content="Already approved">
        <span className="text14Medium text-textTertiary cursor-not-allowed">
          Approve
        </span>
      </Tooltip>
    );
  }

  return (
    <>
      {showDialog && (
        <ApproveAttemptDialog
          onClose={() => setShowDialog(false)}
          lostAccount={lostAccount}
          friendGroupIndex={friendGroupIndex}
          onInBlock={onApprove}
        />
      )}
      <Tooltip content="Approve this recovery attempt">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Approve
        </button>
      </Tooltip>
    </>
  );
}

function FinishButton({
  lostAccount,
  friendGroupIndex,
  initBlock,
  inheritanceDelay,
  onFinish,
}) {
  const [showDialog, setShowDialog] = useState(false);
  const currentBlock = useRelayChainBlockNumber();
  const { blockTime } = useChainSettings();

  const finishBlock = initBlock + (inheritanceDelay || 0);
  const canFinish = !isNil(currentBlock) && currentBlock >= finishBlock;

  if (!canFinish) {
    let tooltip;
    if (isNil(currentBlock)) {
      tooltip = "Loading block number...";
    } else {
      const blocksRemaining = Math.max(0, finishBlock - currentBlock);
      const estimatedTime = estimateBlocksTime(blocksRemaining, blockTime);
      tooltip = `Finish available at block #${finishBlock} (in ${estimatedTime})`;
    }
    return (
      <Tooltip content={tooltip}>
        <span className="text14Medium text-textTertiary cursor-not-allowed">
          Finish
        </span>
      </Tooltip>
    );
  }

  return (
    <>
      {showDialog && (
        <FinishAttemptDialog
          onClose={() => setShowDialog(false)}
          lostAccount={lostAccount}
          friendGroupIndex={friendGroupIndex}
          onInBlock={onFinish}
        />
      )}
      <Tooltip content="Finish the recovery and grant access to the inheritor">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Finish
        </button>
      </Tooltip>
    </>
  );
}

function HelpOthersAttemptActions({
  lostAccount,
  friendGroupIndex,
  initBlock,
  lastApprovalBlock,
  initiator,
  approvalsCount,
  approvedAddresses,
  fgGroup,
  friendsNeeded,
  address,
  onAction,
}) {
  const threshold = fgGroup?.friendsNeeded || friendsNeeded || 0;
  const canFinish = (approvalsCount || 0) >= threshold;

  if (canFinish) {
    return (
      <div className="flex gap-2 justify-end">
        <FinishButton
          lostAccount={lostAccount}
          friendGroupIndex={friendGroupIndex}
          initBlock={initBlock}
          inheritanceDelay={fgGroup?.inheritanceDelay}
          onFinish={onAction}
        />
        {isSameAddress(initiator, address) && (
          <CancelButton
            lostAccount={lostAccount}
            friendGroupIndex={friendGroupIndex}
            lastApprovalBlock={lastApprovalBlock}
            cancelDelay={fgGroup?.cancelDelay}
            onCancel={onAction}
          />
        )}
      </div>
    );
  }

  return isSameAddress(initiator, address) ? (
    <CancelButton
      lostAccount={lostAccount}
      friendGroupIndex={friendGroupIndex}
      lastApprovalBlock={lastApprovalBlock}
      cancelDelay={fgGroup?.cancelDelay}
      onCancel={onAction}
    />
  ) : (
    <ApproveButton
      lostAccount={lostAccount}
      friendGroupIndex={friendGroupIndex}
      onApprove={onAction}
      alreadyApproved={approvedAddresses?.some((a) =>
        isSameAddress(a, address),
      )}
    />
  );
}

export default function useHelpOthersAttemptsColumns(address, onAction) {
  return useMemo(() => {
    const desktopColumns = [
      attemptColumns.lostAccount("min-w-[200px] text-left"),
      attemptColumns.groupIndex("w-[120px] text-left"),
      attemptColumns.initiator("min-w-[160px] text-left"),
      attemptColumns.initBlock("w-[140px] text-left"),
      attemptColumns.lastApprovalBlock("w-[180px] text-left"),
      attemptColumns.thresholdApprovals("w-[160px] text-left"),
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => (
          <HelpOthersAttemptActions
            {...item}
            address={address}
            onAction={onAction}
          />
        ),
      },
    ];

    const mobileColumns = [
      attemptColumns.lostAccount("text-left"),
      attemptColumns.groupIndex("text-right"),
      attemptColumns.initiator("text-left"),
      attemptColumns.initBlock("text-right"),
      attemptColumns.lastApprovalBlock("text-right"),
      attemptColumns.thresholdApprovals("text-right"),
      {
        name: "Action",
        className: "text-left",
        render: (item) => (
          <HelpOthersAttemptActions
            {...item}
            address={address}
            onAction={onAction}
          />
        ),
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [address, onAction]);
}
