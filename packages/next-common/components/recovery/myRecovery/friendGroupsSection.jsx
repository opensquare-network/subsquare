"use client";

import { useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Loading from "next-common/components/loading";
import AddressUser from "next-common/components/user/addressUser";
import useMyFriendGroups from "./hooks/useMyFriendGroups";
import AddFriendGroupDialog from "./addFriendGroupDialog";

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-y-1">
      <span className="text12Medium text-textTertiary">{label}</span>
      <span className="text14Medium text-textPrimary">{value}</span>
    </div>
  );
}

function FriendGroupCard({ group }) {
  return (
    <SecondaryCard>
      {/* Card Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text14Bold text-textPrimary">
          Group #{group.index}
        </span>
        <div className="flex gap-x-3">
          <button
            type="button"
            className="text14Medium text-theme500 cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            className="text14Medium text-theme500 cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field label="Priority" value={group.inheritancePriority} />
        <Field
          label="Friends"
          value={
            <div className="flex flex-wrap gap-1.5">
              {(group.friends || []).map((friend, idx) => (
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
            </div>
          }
        />
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
      </div>
    </SecondaryCard>
  );
}

export default function FriendGroupsSection({ address }) {
  const [showDialog, setShowDialog] = useState(false);
  const { data, loading } = useMyFriendGroups(address);

  return (
    <div>
      {showDialog && (
        <AddFriendGroupDialog onClose={() => setShowDialog(false)} />
      )}
      <div className="flex justify-between items-center pl-6">
        <span className="font-bold text-[16px] leading-6 text-textPrimary">
          Friend Groups
        </span>
        <button
          type="button"
          className="px-4 py-1.5 rounded-lg bg-theme500 text14Bold text-white cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Add
        </button>
      </div>
      {loading ? (
        <div className="mt-4 flex justify-center py-8">
          <Loading size={20} />
        </div>
      ) : data.length === 0 ? (
        <SecondaryCard className="mt-4 flex items-center justify-center min-h-21">
          <span className="text14Medium text-textTertiary">
            No friend groups found
          </span>
        </SecondaryCard>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.map((group) => (
            <FriendGroupCard key={group.index} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
