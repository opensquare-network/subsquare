import React from "react";
import Avatar from "next-common/components/avatar";
import Tooltip from "next-common/components/tooltip";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import AddressUser from "next-common/components/user/addressUser";

export default function AvatarAndAddress({ address, isActive }) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="relative w-10 h-10">
        <Avatar address={address} size={40} />
        <Tooltip
          className={"absolute right-0 bottom-0"}
          content={isActive ? "Active" : "Inactive"}
        >
          <SignalIndicator className="w-4 h-4" active={isActive} />
        </Tooltip>
      </div>

      <AddressUser
        add={address}
        showAvatar={false}
        fontSize={14}
        className="[&_.identity]:!font-semibold"
        linkToFellowshipPage
      />
    </div>
  );
}
