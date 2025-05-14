import { createContext, useContext, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { TeleportButton } from "./paraChainTeleportButton";

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
    <TeleportButton
      onClick={() => {
        setShowParaChainTeleportPopup(true);
      }}
    />
  );
}
