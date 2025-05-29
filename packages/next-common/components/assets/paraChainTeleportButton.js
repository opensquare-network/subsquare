import { useState } from "react";
import Tooltip from "../tooltip";
import ListButton from "../styled/listButton";
import dynamic from "next/dynamic";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

const ParaChainTeleportPopup = dynamicPopup(() =>
  import("./paraChainTeleportPopup"),
);

export function TeleportButton({ onClick }) {
  return (
    <Tooltip content="Cross-chain">
      <ListButton onClick={onClick}>
        <SystemCrosschain width={16} height={16} />
      </ListButton>
    </Tooltip>
  );
}

export default function ParaChainTeleportButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <TeleportButton
        onClick={() => {
          setShowPopup(true);
        }}
      />
      {showPopup && (
        <ParaChainTeleportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
