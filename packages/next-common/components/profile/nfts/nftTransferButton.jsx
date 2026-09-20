import { useState } from "react";
import { SystemTransfer } from "@osn/icons/subsquare";
import ListButton from "next-common/components/styled/listButton";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";

const NftTransferPopup = dynamicPopup(() => import("./nftTransferPopup"));

export default function NftTransferButton({ collectionId, itemId }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Transfer">
        <ListButton onClick={() => setShowPopup(true)}>
          <SystemTransfer width={16} height={16} />
        </ListButton>
      </Tooltip>
      {showPopup && (
        <NftTransferPopup
          collectionId={collectionId}
          itemId={itemId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
