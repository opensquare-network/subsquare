"use client";

import { useMemo, useState } from "react";
import { inheritorColumns } from "next-common/components/recovery/common/columns";
import ControlInheritedAccountDialog from "../controlInheritedAccountDialog";

function ControlButton({ item }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {showDialog && (
        <ControlInheritedAccountDialog
          recovered={item.account}
          onClose={() => setShowDialog(false)}
        />
      )}
      <button
        type="button"
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        Control
      </button>
    </>
  );
}

function InheritedAccountActions({ item }) {
  return <ControlButton item={item} />;
}

export default function useInheritedAccountsColumns() {
  return useMemo(() => {
    const desktopColumns = [
      inheritorColumns.lostAccount("min-w-[200px] text-left"),
      inheritorColumns.inheritor("min-w-[200px] text-left"),
      inheritorColumns.priority("w-[120px] text-left"),
      inheritorColumns.depositor("min-w-[200px] text-left"),
      inheritorColumns.deposit("w-[180px] text-left"),
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => <InheritedAccountActions item={item} />,
      },
    ];

    const mobileColumns = [
      inheritorColumns.lostAccount("text-left"),
      inheritorColumns.inheritor("text-left"),
      inheritorColumns.priority("text-right"),
      inheritorColumns.depositor("text-left"),
      inheritorColumns.deposit("text-right"),
      {
        name: "Action",
        className: "text-left",
        render: (item) => <InheritedAccountActions item={item} />,
      },
    ];

    return { desktopColumns, mobileColumns };
  }, []);
}
