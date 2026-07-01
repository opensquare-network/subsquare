"use client";

import { useMemo, useState } from "react";
import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import RevokeInheritorDialog from "../revokeInheritorDialog";

function TicketCell({ ticket }) {
  const { decimals, symbol } = useChainSettings();
  if (isNil(ticket)) {
    return null;
  }
  return <ValueDisplay value={toPrecision(ticket, decimals)} symbol={symbol} />;
}

function RevokeButton({ onRevoke }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {showDialog && (
        <RevokeInheritorDialog
          onClose={() => setShowDialog(false)}
          onInBlock={onRevoke}
        />
      )}
      <Tooltip content="Revoke the inheritor access">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Revoke
        </button>
      </Tooltip>
    </>
  );
}

export default function useMyRecoveryInheritorColumns(onRevoke) {
  return useMemo(() => {
    const desktopColumns = [
      {
        name: "Inheritor",
        className: "min-w-[200px] text-left",
        render: (item) => (
          <AddressUser key="inheritor" add={item.inheritor} maxWidth={200} />
        ),
      },
      {
        name: "Priority",
        className: "w-[120px] text-left",
        render: (item) => (
          <span className="text14Medium text-textPrimary">
            {item.inheritancePriority}
          </span>
        ),
      },
      {
        name: "Depositor",
        className: "min-w-[200px] text-left",
        render: (item) => (
          <AddressUser key="depositor" add={item.depositor} maxWidth={200} />
        ),
      },
      {
        name: "Deposit",
        className: "w-[180px] text-left",
        render: (item) => <TicketCell ticket={item.ticket} />,
      },
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: () => <RevokeButton onRevoke={onRevoke} />,
      },
    ];

    const mobileColumns = [
      {
        name: "Inheritor",
        className: "text-left",
        render: (item) => <AddressUser add={item.inheritor} maxWidth={160} />,
      },
      {
        name: "Priority",
        className: "text-right",
        render: (item) => (
          <span className="text14Medium text-textTertiary">
            {item.inheritancePriority}
          </span>
        ),
      },
      {
        name: "Depositor",
        className: "text-left",
        render: (item) => <AddressUser add={item.depositor} maxWidth={120} />,
      },
      {
        name: "Deposit",
        className: "text-right",
        render: (item) => <TicketCell ticket={item.ticket} />,
      },
      {
        name: "Action",
        className: "text-left",
        render: () => <RevokeButton onRevoke={onRevoke} />,
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onRevoke]);
}
