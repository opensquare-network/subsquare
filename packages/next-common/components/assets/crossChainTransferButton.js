import { useState } from "react";
import Tooltip from "../tooltip";
import ListButton from "../styled/listButton";
import dynamic from "next/dynamic";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

const CrossChainTransferPopup = dynamicClientOnly(() =>
  import("./crossChainTransferPopup").then(
    (module) => module.CrossChainTransferPopup,
  ),
);

export default function CrossChainTransferButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="Cross-chain">
        <ListButton
          onClick={() => {
            setShowPopup(true);
          }}
        >
          <SystemCrosschain width={16} height={16} />
        </ListButton>
      </Tooltip>
      {showPopup && (
        <CrossChainTransferPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
