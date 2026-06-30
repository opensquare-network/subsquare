"use client";

import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function RemoveFriendGroupDialog({
  onClose,
  index,
  address,
  onInBlock = () => {},
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    const raw = await api.query.recovery.friendGroups(address);
    const json = raw.toJSON();
    const currentGroups = Array.isArray(json?.[0]) ? json[0] : [];

    const updatedGroups = currentGroups.filter((_, idx) => idx !== index);

    return api.tx.recovery.setFriendGroups(updatedGroups);
  }, [api, address, index]);

  return (
    <SimpleTxPopup
      title={`Remove Friend Group #${index}`}
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
