import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useMemo } from "react";
import Link from "next/link";
import useAssetsFromAssetHub from "../hook/useAssetsFromAssetHub";
import { AssetHubProvider } from "next-common/context/assetHub";
import { AssetHubMetadataProvider } from "next-common/components/overview/accountInfo/context/assetHubMetadataContext";
import Chains from "next-common/utils/consts/chains";
import OnlyChain from "next-common/components/common/onlyChain";

export function PromptContent() {
  const assets = useAssetsFromAssetHub();

  return useMemo(() => {
    if (!assets || assets.length === 0) {
      return null;
    }

    const assetsAmount = assets.length;
    const manageContent = assetsAmount > 1 ? "them" : "it";
    return (
      <Prompt
        cacheKey={CACHE_KEY.assetHubPromptVisible}
        type={PromptTypes.NEUTRAL}
      >
        You have {assetsAmount} assets on AssetHub. Manage {manageContent}&nbsp;
        <Link
          className="underline"
          href={"https://polkadot-assethub.subsquare.io/"}
        >
          here
        </Link>
      </Prompt>
    );
  }, [assets]);
}

export default function AssetHubManagePrompt() {
  return (
    <OnlyChain chain={Chains.polkadot}>
      <AssetHubProvider>
        <AssetHubMetadataProvider>
          <PromptContent />
        </AssetHubMetadataProvider>
      </AssetHubProvider>
    </OnlyChain>
  );
}
