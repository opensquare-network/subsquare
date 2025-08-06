import React, { useState } from "react";
import { SystemTransfer } from "@osn/icons/subsquare";
import ListButton from "next-common/components/styled/listButton";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ForeignAssetTransferPopup = dynamicPopup(() => import("./popup"));

export default function ForeignAssetTransferButton({ asset }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Transfer">
        <ListButton
          onClick={() => {
            setShowPopup(true);
          }}
        >
          <SystemTransfer width={16} height={16} />
        </ListButton>
      </Tooltip>
      {showPopup && (
        <ForeignAssetTransferPopup
          asset={asset}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
