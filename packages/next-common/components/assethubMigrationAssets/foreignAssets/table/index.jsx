import { foreignAssetsColumnsDef } from "./columns/index";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TransferPopupProvider } from "./transferPopup/context";
import ForeignAssetTransferPopup from "./transferPopup";
import SubscribedForeignAssetsList from "next-common/components/assethubMigrationAssets/subscribedForeignAssetsList";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function ForeignAssetsTable() {
  const realAddress = useRealAddress();

  return (
    <TransferPopupProvider>
      <SecondaryCard>
        <SubscribedForeignAssetsList
          address={realAddress}
          columnsDef={foreignAssetsColumnsDef}
        />
      </SecondaryCard>
      <ForeignAssetTransferPopup />
    </TransferPopupProvider>
  );
}
