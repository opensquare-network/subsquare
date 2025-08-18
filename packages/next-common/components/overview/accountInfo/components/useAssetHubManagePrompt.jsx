import { PromptTypes } from "next-common/components/scrollPrompt";
import { useChain } from "next-common/context/chain";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Chains from "next-common/utils/consts/chains";
import useAssetsFromAssetHub from "../hook/useAssetsFromAssetHub";
import Link from "next/link";
import { useMemo } from "react";

export default function useAssetHubManagePrompt() {
  const chain = useChain();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.assetHubPromptVisible,
    true,
  );

  const assets = useAssetsFromAssetHub();
  const assetsAmount = assets?.length || 0;

  return useMemo(() => {
    if (!visible || Chains.polkadot !== chain || !assetsAmount) {
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
  }, [assetsAmount, chain, setVisible, visible]);
}
