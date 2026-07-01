"use client";

import { useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tooltip from "next-common/components/tooltip";
import Loading from "next-common/components/loading";
import AddressUser from "next-common/components/user/addressUser";
import DelayBlock from "next-common/components/recovery/delayBlock";
import { useRecoveryData } from "./context";
import AddFriendGroupDialog from "./addFriendGroupDialog";
import EditFriendGroupDialog from "./editFriendGroupDialog";
import RemoveFriendGroupDialog from "./removeFriendGroupDialog";

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-y-1">
      <span className="text12Medium text-textTertiary">{label}</span>
      <span className="text14Medium text-textPrimary">{value}</span>
    </div>
  );
}

function FriendGroupCard({ group, onEdit, onRemove }) {
  const [showAllFriends, setShowAllFriends] = useState(false);
  const displayedFriends = showAllFriends
    ? group.friends || []
    : (group.friends || []).slice(0, 5);
  const hasMore = (group.friends || []).length > 5;

  return (
    <SecondaryCard>
      {/* Card Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text14Bold text-textPrimary">
          Group #{group.index}
        </span>
        <div className="flex gap-x-3">
          <Tooltip content="Edit this friend group">
            <button
              type="button"
              className="text14Medium text-theme500 cursor-pointer"
              onClick={() => onEdit(group)}
            >
              Edit
            </button>
          </Tooltip>
          <Tooltip content="Remove this friend group">
            <button
              type="button"
              className="text14Medium text-theme500 cursor-pointer"
              onClick={() => onRemove(group.index)}
            >
              Remove
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-3 gap-x-4 gap-y-3">
          <Field label="Priority" value={group.inheritancePriority} />
          <Field label="Friends Count" value={group.friends?.length || 0} />
          <Field label="Threshold" value={group.friendsNeeded} />
          <Field
            label="Inheritor"
            value={
              group.inheritor ? (
                <AddressUser add={group.inheritor} maxWidth={160} />
              ) : (
                <span className="text14Medium text-textTertiary">None</span>
              )
            }
          />
          <Field
            label="Inheritance Delay"
            value={<DelayBlock blocks={group.inheritanceDelay} />}
          />
          <Field
            label="Cancel Delay"
            value={<DelayBlock blocks={group.cancelDelay} />}
          />
        </div>

        <Field
          label="Friends List"
          value={
            <div className="flex flex-wrap gap-1.5">
              {displayedFriends.map((friend, idx) => (
                <div
                  key={idx}
                  className="rounded-full border border-neutral400 px-2 py-0.5"
                >
                  <AddressUser
                    add={friend}
                    avatarSize="16px"
                    className="text12Medium"
                  />
                </div>
              ))}
              {hasMore && !showAllFriends && (
                <button
                  type="button"
                  className="text12Medium text-theme500 cursor-pointer"
                  onClick={() => setShowAllFriends(true)}
                >
                  See all »
                </button>
              )}
              {showAllFriends && (
                <button
                  type="button"
                  className="text12Medium text-theme500 cursor-pointer"
                  onClick={() => setShowAllFriends(false)}
                >
                  « Hide
                </button>
              )}
            </div>
          }
        />
      </div>
    </SecondaryCard>
  );
}

export default function FriendGroupsSection() {
  const { friendGroups, friendGroupsLoading, fetchFriendGroups, address } =
    useRecoveryData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removingIndex, setRemovingIndex] = useState(null);

  return (
    <div>
      {showAddDialog && (
        <AddFriendGroupDialog
          onClose={() => setShowAddDialog(false)}
          onInBlock={fetchFriendGroups}
        />
      )}
      {showEditDialog && editingGroup && (
        <EditFriendGroupDialog
          onClose={() => {
            setShowEditDialog(false);
            setEditingGroup(null);
          }}
          group={editingGroup}
          onInBlock={fetchFriendGroups}
        />
      )}
      {showRemoveDialog && (
        <RemoveFriendGroupDialog
          onClose={() => {
            setShowRemoveDialog(false);
            setRemovingIndex(null);
          }}
          index={removingIndex}
          address={address}
          onInBlock={fetchFriendGroups}
        />
      )}
      <div className="flex justify-between items-center pl-6 pr-6">
        <span className="font-bold text-[16px] leading-6 text-textPrimary">
          Friend Groups
        </span>
        <Tooltip content="Add a new friend group">
          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-theme500 text14Bold text-white cursor-pointer"
            onClick={() => setShowAddDialog(true)}
          >
            Add
          </button>
        </Tooltip>
      </div>
      {friendGroupsLoading ? (
        <div className="mt-4 flex justify-center py-8">
          <Loading size={20} />
        </div>
      ) : friendGroups.length === 0 ? (
        <SecondaryCard className="mt-4 flex items-center justify-center min-h-21">
          <span className="text14Medium text-textTertiary">
            No friend groups found
          </span>
        </SecondaryCard>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {friendGroups.map((group) => (
            <FriendGroupCard
              key={group.index}
              group={group}
              onEdit={(g) => {
                setEditingGroup(g);
                setShowEditDialog(true);
              }}
              onRemove={(index) => {
                setRemovingIndex(index);
                setShowRemoveDialog(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
