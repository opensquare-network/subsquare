"use client";

import { useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import AddressUser from "next-common/components/user/addressUser";
import { isSameAddress } from "next-common/utils";
import BlockNumberWithTooltip from "../../myRecovery/blockNumberWithTooltip";
import CancelAttemptDialog from "../cancelAttemptDialog";
import ApproveAttemptDialog from "../approveAttemptDialog";
import FinishAttemptDialog from "../finishAttemptDialog";

function CancelButton({ lostAccount, friendGroupIndex, onCancel }) {
  const [showDialog, setShowDialog] = useState(false);

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
      <button
        type="button"
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        Cancel
      </button>
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
      <button
        type="button"
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        Approve
      </button>
    </>
  );
}

function FinishButton({ lostAccount, friendGroupIndex, onFinish }) {
  const [showDialog, setShowDialog] = useState(false);

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
      <button
        type="button"
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        Finish
      </button>
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
        className: "min-w-[200px] text-left",
        render: (item) => (
          <AddressUser key="initiator" add={item.initiator} maxWidth={200} />
        ),
      },
      {
        name: "Init Block",
        className: "w-[180px] text-left",
        render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
      },
      {
        name: "Last Approval Block",
        className: "w-[200px] text-left",
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
              <FinishButton
                lostAccount={item.lostAccount}
                friendGroupIndex={item.friendGroupIndex}
                onFinish={onAction}
              />
            );
          }

          return isSameAddress(item.initiator, address) ? (
            <CancelButton
              lostAccount={item.lostAccount}
              friendGroupIndex={item.friendGroupIndex}
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
              <FinishButton
                lostAccount={item.lostAccount}
                friendGroupIndex={item.friendGroupIndex}
                onFinish={onAction}
              />
            );
          }

          return isSameAddress(item.initiator, address) ? (
            <CancelButton
              lostAccount={item.lostAccount}
              friendGroupIndex={item.friendGroupIndex}
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
