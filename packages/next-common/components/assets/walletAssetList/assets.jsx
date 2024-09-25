import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList";

export default function Assets() {
  return (
    <div>
      <SecondaryCard>
        <AssetsList />
      </SecondaryCard>
    </div>
  );
}
