import React from "react";
import { SystemTransfer } from "@osn/icons/subsquare";
import ListButton from "next-common/components/styled/listButton";
import Tooltip from "next-common/components/tooltip";
import { useTransferPopup } from "../transferPopup/context";

function TransferButton({ asset }) {
  const { setVisible, setCurrentAsset } = useTransferPopup();

  const handleClick = () => {
    setCurrentAsset(asset);
    setVisible(true);
  };

  return (
    <Tooltip content="Transfer">
      <ListButton onClick={handleClick}>
        <SystemTransfer width={16} height={16} />
      </ListButton>
    </Tooltip>
  );
}

export const colTransfer = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: (item) => {
    return <TransferButton asset={item} />;
  },
};
