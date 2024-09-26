import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsList from "next-common/components/assets/assetsList";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function Assets() {
  const address = useRealAddress();
  return (
    <div>
      <SecondaryCard>
        <AssetsList address={address} />
      </SecondaryCard>
    </div>
  );
}
