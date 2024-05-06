import React, { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import Tab from "next-common/components/tab";
import Avatar from "next-common/components/avatar";
import { useUser } from "next-common/context/user";
import Input from "next-common/components/input";
import PrimaryButton from "next-common/lib/button/primary";

export default function DeleteEventModal({ onClose }) {
  const [tabId, setTabId] = useState("myself");
  const [inputAddress, setInputAddress] = useState("");
  const user = useUser();
  const tabs = [
    {
      tabId: "myself",
      tabTitle: "Myself",
    },
    {
      tabId: "other",
      tabTitle: "Other",
    },
  ];

  return (
    <Popup className="w-[592px]" title="Payout to" onClose={onClose}>
      <Tab
        selectedTabId={tabId}
        setSelectedTabId={(id) => {
          setTabId(id);
        }}
        tabs={tabs}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text14Bold text-textPrimary">Origin</span>
        </div>
        {tabId === "other" && (
          <div className="flex flex-col gap-2">
            <span className="text14Bold text-textPrimary">Beneficiary</span>
            <Input
              className="h-[64px]"
              prefix={
                <Avatar
                  className="ml-[4px]"
                  size={40}
                  address={user?.address}
                />
              }
              placeholder="Please fill the address..."
              value={inputAddress}
              onChange={(e) => {
                setInputAddress(e.target.value);
              }}
            />
          </div>
        )}
        <div className="flex justify-end">
          <PrimaryButton disabled={tabId === "other" && !inputAddress}>
            Confirm
          </PrimaryButton>
        </div>
      </div>
    </Popup>
  );
}
