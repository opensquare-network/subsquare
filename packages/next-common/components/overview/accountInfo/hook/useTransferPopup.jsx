import AssetTransferPopup from "next-common/components/assets/transferPopup";
import { useMyNativeAsset } from "next-common/components/assets/useMyAssets";
import { useState } from "react";

export function useAccountTransferPopup() {
  const nativeAsset = useMyNativeAsset();
  const [isOpen, setIsOpen] = useState(false);
  const component = isOpen && (
    <AssetTransferPopup
      asset={nativeAsset?.value}
      onClose={() => setIsOpen(false)}
    />
  );

  return {
    showPopup: () => setIsOpen(true),
    component,
  };
}
