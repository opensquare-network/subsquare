"use client";

import { useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import AddressUser from "next-common/components/user/addressUser";
import { isSameAddress, estimateBlocksTime } from "next-common/utils";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import useRelayChainBlockNumber from "next-common/hooks/useRelayChainBlockNumber";
import BlockNumberWithTooltip from "../../myRecovery/blockNumberWithTooltip";
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

export default function useHelpOthersAttemptsColumns(address, onAction) {
  return useMemo(() => {
    const desktopColumns = [
      {
        name: "Lost Account",
        className: "min-w-[200px] text-left",
        render: (item) => (
          <AddressUser
            key="lostAccount"
            add={item.lostAccount}
            maxWidth={200}
          />
        ),
      },
      {
        name: "Group Index",
        className: "w-[120px] text-left",
        render: (item) => (
          <Tooltip
            content={
              item.fgGroup && (
                <AddressesTooltip
                  addresses={item.fgGroup?.friends || []}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary">
              #{item.friendGroupIndex}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Initiator",
        className: "min-w-[160px] text-left",
        render: (item) => (
          <AddressUser key="initiator" add={item.initiator} maxWidth={160} />
        ),
      },
      {
        name: "Init Block",
        className: "w-[140px] text-left",
        render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
      },
      {
        name: "Last Approval Block",
        className: "w-[180px] text-left",
        render: (item) => (
          <BlockNumberWithTooltip height={item.lastApprovalBlock} />
        ),
      },
      {
        name: "Threshold / Approvals",
        className: "w-[160px] text-left",
        render: (item) => (
          <Tooltip
            content={
              item.approvedAddresses?.length > 0 && (
                <AddressesTooltip
                  addresses={item.approvedAddresses}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary">
              {item.fgGroup && (
                <span className="text-textTertiary">
                  {item.fgGroup?.friendsNeeded || 0} /{" "}
                </span>
              )}
              {item.approvalsCount}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => {
          const threshold =
            item.fgGroup?.friendsNeeded || item.friendsNeeded || 0;
          const canFinish = (item.approvalsCount || 0) >= threshold;

          if (canFinish) {
            return (
              <div className="flex gap-2 justify-end">
                <FinishButton
                  lostAccount={item.lostAccount}
                  friendGroupIndex={item.friendGroupIndex}
                  initBlock={item.initBlock}
                  inheritanceDelay={item.fgGroup?.inheritanceDelay}
                  onFinish={onAction}
                />
                {isSameAddress(item.initiator, address) && (
                  <CancelButton
                    lostAccount={item.lostAccount}
                    friendGroupIndex={item.friendGroupIndex}
                    lastApprovalBlock={item.lastApprovalBlock}
                    cancelDelay={item.fgGroup?.cancelDelay}
                    onCancel={onAction}
                  />
                )}
              </div>
            );
          }

          return isSameAddress(item.initiator, address) ? (
            <CancelButton
              lostAccount={item.lostAccount}
              friendGroupIndex={item.friendGroupIndex}
              lastApprovalBlock={item.lastApprovalBlock}
              cancelDelay={item.fgGroup?.cancelDelay}
              onCancel={onAction}
            />
          ) : (
            <ApproveButton
              lostAccount={item.lostAccount}
              friendGroupIndex={item.friendGroupIndex}
              onApprove={onAction}
              alreadyApproved={item.approvedAddresses?.some((a) =>
                isSameAddress(a, address),
              )}
            />
          );
        },
      },
    ];

    const mobileColumns = [
      {
        name: "Lost Account",
        className: "text-left",
        render: (item) => <AddressUser add={item.lostAccount} maxWidth={160} />,
      },
      {
        name: "Group Index",
        className: "text-right",
        render: (item) => (
          <Tooltip
            content={
              item.fgGroup && (
                <AddressesTooltip
                  addresses={item.fgGroup?.friends || []}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary cursor-pointer">
              #{item.friendGroupIndex}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Initiator",
        className: "text-left",
        render: (item) => <AddressUser add={item.initiator} maxWidth={120} />,
      },
      {
        name: "Init Block",
        className: "text-right",
        render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
      },
      {
        name: "Last Approval Block",
        className: "text-right",
        render: (item) => (
          <BlockNumberWithTooltip height={item.lastApprovalBlock} />
        ),
      },
      {
        name: "Threshold / Approvals",
        className: "text-right",
        render: (item) => (
          <Tooltip
            content={
              item.approvedAddresses?.length > 0 && (
                <AddressesTooltip
                  addresses={item.approvedAddresses}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary">
              {item.fgGroup && (
                <span className="text-textTertiary">
                  {item.fgGroup?.friendsNeeded || 0} /{" "}
                </span>
              )}
              {item.approvalsCount}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Action",
        className: "text-left",
        render: (item) => {
          const threshold =
            item.fgGroup?.friendsNeeded || item.friendsNeeded || 0;
          const canFinish = (item.approvalsCount || 0) >= threshold;

          if (canFinish) {
            return (
              <div className="flex gap-2 justify-end">
                <FinishButton
                  lostAccount={item.lostAccount}
                  friendGroupIndex={item.friendGroupIndex}
                  initBlock={item.initBlock}
                  inheritanceDelay={item.fgGroup?.inheritanceDelay}
                  onFinish={onAction}
                />
                {isSameAddress(item.initiator, address) && (
                  <CancelButton
                    lostAccount={item.lostAccount}
                    friendGroupIndex={item.friendGroupIndex}
                    lastApprovalBlock={item.lastApprovalBlock}
                    cancelDelay={item.fgGroup?.cancelDelay}
                    onCancel={onAction}
                  />
                )}
              </div>
            );
          }

          return isSameAddress(item.initiator, address) ? (
            <CancelButton
              lostAccount={item.lostAccount}
              friendGroupIndex={item.friendGroupIndex}
              lastApprovalBlock={item.lastApprovalBlock}
              cancelDelay={item.fgGroup?.cancelDelay}
              onCancel={onAction}
            />
          ) : (
            <ApproveButton
              lostAccount={item.lostAccount}
              friendGroupIndex={item.friendGroupIndex}
              onApprove={onAction}
              alreadyApproved={item.approvedAddresses?.some((a) =>
                isSameAddress(a, address),
              )}
            />
          );
        },
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [address, onAction]);
}
