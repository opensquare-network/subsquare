import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Chains from "next-common/utils/consts/chains";
import useAssetsFromAssetHub from "../hook/useAssetsFromAssetHub";
import Link from "next/link";
import { useMemo } from "react";
import { isEmpty } from "lodash-es";
import { OnlyChains } from "next-common/components/common/onlyChain";
import { AssetHubMetadataProvider } from "../context/assetHubMetadataContext";

function useAssetHubManagePrompt() {
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.assetHubPromptVisible,
    true,
  );

  const assets = useAssetsFromAssetHub();
  const assetsAmount = assets?.length || 0;

  return useMemo(() => {
    if (!visible || !assetsAmount) {
      return {};
    }
    return {
      key: CACHE_KEY.assetHubPromptVisible,
      message: (
        <div>
          You have {assetsAmount} assets on AssetHub. Manage{" "}
          {assetsAmount > 1 ? "them" : "it"}
          &nbsp;
          <Link className="underline" href="/assethub">
            here
          </Link>
        </div>
      ),
      type: PromptTypes.NEUTRAL,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [assetsAmount, setVisible, visible]);
}

export default function AssetHubManagePrompt({ onClose }) {
  return (
    <OnlyChains chains={[Chains.polkadex, Chains.kusama]}>
      <AssetHubMetadataProvider>
        <AssetHubManagePromptImpl onClose={onClose} />
      </AssetHubMetadataProvider>
    </OnlyChains>
  );
}

function AssetHubManagePromptImpl({ onClose }) {
  const prompt = useAssetHubManagePrompt();
  if (isEmpty(prompt)) {
    return null;
  }
  return (
    <ScrollPromptItemWrapper
      prompt={{
        ...prompt,
        close: () => {
          onClose?.();
          prompt?.close();
        },
      }}
    />
  );
}
