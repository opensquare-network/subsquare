import useAssets from "next-common/components/assets/useAssets";
import { Title } from "next-common/components/assets/walletAssetList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProfileAssetsList from "./assetsList";

export default function ProfileAssets() {
  const assets = useAssets();

  return (
    <div className="flex flex-col gap-[16px]">
      <Title assets={assets} />
      <SecondaryCard>
        <ProfileAssetsList assets={assets} />
      </SecondaryCard>
    </div>
  );
}
