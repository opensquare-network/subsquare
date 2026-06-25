"use client";

import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Loading from "next-common/components/loading";
import AddressUser from "next-common/components/user/addressUser";
import useMyFriendGroups from "./hooks/useMyFriendGroups";

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
            className="text14Medium text-red500 cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="grid grid-cols-2 gap-y-3">
        <Field label="Priority" value={group.inheritancePriority} />
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

      <div className="mt-3">
        <span className="text12Medium text-textTertiary">Friends</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {(group.friends || []).map((friend, idx) => (
            <div
              key={idx}
              className="rounded-full border border-neutral300 px-2 py-1"
            >
              <AddressUser
                add={friend}
                avatarSize="16px"
                className="text12Medium"
              />
            </div>
          ))}
        </div>
      </div>
    </SecondaryCard>
  );
}

export default function FriendGroupsSection({ address }) {
  const { data, loading } = useMyFriendGroups(address);

  return (
    <div>
      <div className="flex justify-between items-center pl-6">
        <span className="font-bold text-[16px] leading-6 text-textPrimary">
          Friend Groups
        </span>
        <button
          type="button"
          className="px-4 py-1.5 rounded-lg bg-theme500 text14Bold text-white cursor-pointer"
        >
          Add
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading ? (
          <div className="flex justify-center py-8 col-span-full">
            <Loading size={20} />
          </div>
        ) : data.length === 0 ? (
          <SecondaryCard>
            <div className="text14Medium text-textTertiary text-center py-4">
              No friend groups found
            </div>
          </SecondaryCard>
        ) : (
          data.map((group) => (
            <FriendGroupCard key={group.index} group={group} />
          ))
        )}
      </div>
    </div>
  );
}
