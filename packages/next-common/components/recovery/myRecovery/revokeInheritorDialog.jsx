"use client";

import { useCallback } from "react";
import AddressUser from "next-common/components/user/addressUser";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text14Medium text-textTertiary">{label}</span>
      <div className="text14Medium text-textPrimary">{children}</div>
    </div>
  );
}

export default function RevokeInheritorDialog({
  onClose,
  inheritor,
  onInBlock = () => {},
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.recovery.revokeInheritor();
  }, [api]);

  return (
    <SimpleTxPopup
      title="Revoke Inheritor"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    >
      <div className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-neutralSecondaryBg">
        <InfoRow label="Inheritor">
          <AddressUser add={inheritor?.inheritor} />
        </InfoRow>
        <InfoRow label="Lost Account">
          <AddressUser add={inheritor?.account} />
        </InfoRow>
        <InfoRow label="Priority">{inheritor?.inheritancePriority}</InfoRow>
      </div>
    </SimpleTxPopup>
  );
}
