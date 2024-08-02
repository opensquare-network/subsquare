import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useMemo } from "react";
import Link from "next/link";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import useAssetHubOnPolkadot from "../hook/useAssetHubOnPolkadot";

export default function AssetHubManagePrompt() {
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.assetHubPromptVisible,
    true,
  );
  const assets = useAssetHubOnPolkadot();

  return useMemo(() => {
    if (!assets || assets.length === 0 || !visible) {
      return null;
    }

    const assetsAmount = assets.length;
    let manageContent = `them`;
    if (assetsAmount === 1) {
      manageContent = `it`;
    }

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
  }, [setVisible, assets, visible]);
}
