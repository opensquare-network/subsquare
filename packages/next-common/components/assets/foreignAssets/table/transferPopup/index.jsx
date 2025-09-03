import React from "react";
import { useTransferPopup } from "./context";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ForeignAssetTransferPopupContent = dynamicPopup(() =>
  import("./content"),
);

export default function ForeignAssetTransferPopup() {
  const { visible, setVisible, currentAsset } = useTransferPopup();

  if (!visible || !currentAsset) {
    return null;
  }

  return (
    <ForeignAssetTransferPopupContent
      asset={currentAsset}
      onClose={() => setVisible(false)}
    />
  );
}
