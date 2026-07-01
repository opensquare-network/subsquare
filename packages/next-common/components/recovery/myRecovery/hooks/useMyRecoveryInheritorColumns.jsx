"use client";

import { useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { inheritorColumns } from "next-common/components/recovery/common/columns";
import RevokeInheritorDialog from "../revokeInheritorDialog";

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

function MyInheritorActions({ onRevoke }) {
  return <RevokeButton onRevoke={onRevoke} />;
}

export default function useMyRecoveryInheritorColumns(onRevoke) {
  return useMemo(() => {
    const desktopColumns = [
      inheritorColumns.inheritor("min-w-[200px] text-left"),
      inheritorColumns.priority("w-[120px] text-left"),
      inheritorColumns.depositor("min-w-[200px] text-left"),
      inheritorColumns.deposit("w-[180px] text-left"),
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: () => <MyInheritorActions onRevoke={onRevoke} />,
      },
    ];

    const mobileColumns = [
      inheritorColumns.inheritor("text-left"),
      inheritorColumns.priority("text-right"),
      inheritorColumns.depositor("text-left"),
      inheritorColumns.deposit("text-right"),
      {
        name: "Action",
        className: "text-left",
        render: () => <MyInheritorActions onRevoke={onRevoke} />,
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onRevoke]);
}
