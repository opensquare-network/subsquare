import ForeignAssetsList from "./table";
import { AllForeignAssetsProvider } from "next-common/context/foreignAssets/allForeignAssets";

export default function AllForeignAssetsList() {
  return (
    <AllForeignAssetsProvider>
      <ForeignAssetsList />
    </AllForeignAssetsProvider>
  );
}
