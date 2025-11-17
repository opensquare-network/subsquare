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

function useAssetsManagePrompt() {
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.assetsPromptVisible,
    true,
  );

  const assets = useAssetsFromAssetHub();
  const assetsAmount = assets?.length || 0;

  return useMemo(() => {
    if (!visible || !assetsAmount) {
      return {};
    }
    return {
      key: CACHE_KEY.assetsPromptVisible,
      message: (
        <div>
          You have {assetsAmount} assets. Manage{" "}
          {assetsAmount > 1 ? "them" : "it"}
          &nbsp;
          <Link className="underline" href="/assets">
            here
          </Link>
        </div>
      ),
      type: PromptTypes.NEUTRAL,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [assetsAmount, setVisible, visible]);
}

export default function AssetsManagePrompt({ onClose }) {
  return (
    <OnlyChains chains={[Chains.polkadex, Chains.kusama]}>
      <AssetHubMetadataProvider>
        <AssetsManagePromptImpl onClose={onClose} />
      </AssetHubMetadataProvider>
    </OnlyChains>
  );
}

function AssetsManagePromptImpl({ onClose }) {
  const prompt = useAssetsManagePrompt();
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
