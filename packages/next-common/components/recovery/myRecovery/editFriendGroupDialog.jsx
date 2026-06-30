"use client";

import { useCallback, useState } from "react";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import {
  useExtensionAccounts,
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useContextApi } from "next-common/context/api";
import { isSameAddress } from "next-common/utils";
import { sortAddresses } from "@polkadot/util-crypto";
import {
  PriorityField,
  FriendsField,
  ThresholdField,
  InheritorField,
  DelayField,
} from "./friendGroupFields";

function EditFriendGroupForm({ onInBlock = () => {} }) {
  const { onClose, group } = usePopupParams();
  const extensionAccounts = useExtensionAccounts();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const accounts = (extensionAccounts || []).map((acc) => ({
    address: acc.address,
    name: acc.meta?.name,
    disabled: acc?.disabled ?? false,
  }));

  const [priority, setPriority] = useState(
    String(group.inheritancePriority ?? 0),
  );
  const [friends, setFriends] = useState(
    group.friends?.length ? group.friends : [""],
  );
  const [threshold, setThreshold] = useState(String(group.friendsNeeded ?? 1));
  const [inheritor, setInheritor] = useState(group.inheritor || "");
  const [inheritorDelay, setInheritorDelay] = useState(
    String(group.inheritanceDelay ?? ""),
  );
  const [cancelDelay, setCancelDelay] = useState(
    String(group.cancelDelay ?? ""),
  );

  const addFriend = () => setFriends([...friends, ""]);
  const removeFriend = (idx) => {
    if (friends.length <= 1) return;
    const next = friends.filter((_, i) => i !== idx);
    setFriends(next);
    if (parseInt(threshold) > next.length) {
      setThreshold(String(next.length));
    }
  };
  const updateFriend = (idx, addr) => {
    const next = [...friends];
    next[idx] = addr;
    setFriends(next);
  };

  const validFriendsCount = friends.filter(Boolean).length;

  const getTxFunc = useCallback(async () => {
    const validFriends = friends.filter(Boolean);
    if (validFriends.length === 0) {
      throw new Error("Please add at least one friend address");
    }

    if (validFriends.some((friend) => isSameAddress(friend, address))) {
      throw new Error("Cannot add yourself as a friend");
    }

    const thresholdNum = parseInt(threshold);
    if (!thresholdNum || thresholdNum < 1) {
      throw new Error("Please enter a valid threshold");
    }
    if (thresholdNum > validFriends.length) {
      throw new Error("Threshold cannot exceed the number of friends");
    }

    if (!inheritor) {
      throw new Error("Please enter the inheritor address");
    }

    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum)) {
      throw new Error("Please select a valid priority");
    }

    const inheritorDelayNum = parseInt(inheritorDelay);
    if (!inheritorDelay || isNaN(inheritorDelayNum) || inheritorDelayNum < 0) {
      throw new Error("Please enter a valid inheritor delay");
    }

    const cancelDelayNum = parseInt(cancelDelay);
    if (!cancelDelay || isNaN(cancelDelayNum) || cancelDelayNum < 0) {
      throw new Error("Please enter a valid cancel delay");
    }

    const sortedFriends = sortAddresses(validFriends).filter(
      (addr, i, arr) => i === 0 || addr !== arr[i - 1],
    );

    const raw = await api.query.recovery.friendGroups(address);
    const json = raw.toJSON();
    const currentGroups = Array.isArray(json?.[0]) ? json[0] : [];

    const updatedGroups = currentGroups.map((g, idx) => {
      if (idx === group.index) {
        return {
          friends: sortedFriends,
          friendsNeeded: thresholdNum,
          inheritor,
          inheritancePriority: priorityNum,
          inheritanceDelay: inheritorDelayNum,
          cancelDelay: cancelDelayNum,
        };
      }
      return g;
    });

    return api.tx.recovery.setFriendGroups(updatedGroups);
  }, [
    api,
    address,
    friends,
    threshold,
    priority,
    inheritor,
    inheritorDelay,
    cancelDelay,
    group.index,
  ]);

  return (
    <Popup title={`Edit Friend Group #${group.index}`} onClose={onClose}>
      <SignerWithBalance />

      <PriorityField value={priority} onChange={setPriority} />

      <FriendsField
        friends={friends}
        accounts={accounts}
        onAdd={addFriend}
        onRemove={removeFriend}
        onUpdate={updateFriend}
      />

      <ThresholdField
        value={threshold}
        onChange={setThreshold}
        max={validFriendsCount}
      />

      <InheritorField
        accounts={accounts}
        value={inheritor}
        onChange={setInheritor}
      />

      <DelayField
        label="Inheritor Delay (blocks)"
        tooltip="Delay in blocks before the inheritor can claim the account after a successful recovery"
        value={inheritorDelay}
        onChange={setInheritorDelay}
      />

      <DelayField
        label="Cancel Delay (blocks)"
        tooltip="Delay in blocks before a recovery attempt can be cancelled"
        value={cancelDelay}
        onChange={setCancelDelay}
      />

      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>

      <TxSubmissionButton
        title="Save"
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
      />
    </Popup>
  );
}

export default function EditFriendGroupDialog({
  onClose,
  group,
  onInBlock = () => {},
}) {
  return (
    <SignerPopupWrapper onClose={onClose} group={group}>
      <EditFriendGroupForm onInBlock={onInBlock} />
    </SignerPopupWrapper>
  );
}
