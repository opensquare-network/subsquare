import { createContext, useContext, useState } from "react";
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

const ParaChainTeleportPopupContext = createContext();

export function ParaChainTeleportPopupProvider({ children }) {
  const [showParaChainTeleportPopup, setShowParaChainTeleportPopup] =
    useState(false);
  return (
    <ParaChainTeleportPopupContext.Provider
      value={{ setShowParaChainTeleportPopup }}
    >
      {children}
      {showParaChainTeleportPopup && (
        <ParaChainTeleportPopup
          onClose={() => setShowParaChainTeleportPopup(false)}
        />
      )}
    </ParaChainTeleportPopupContext.Provider>
  );
}

export default function ParaChainTeleportButton() {
  const { setShowParaChainTeleportPopup } = useContext(
    ParaChainTeleportPopupContext,
  );
  return (
    <>
      <Tooltip content="Cross-chain">
        <ListButton
          onClick={() => {
            setShowParaChainTeleportPopup(true);
          }}
        >
          <SystemCrosschain width={16} height={16} />
        </ListButton>
      </Tooltip>
    </>
  );
}
