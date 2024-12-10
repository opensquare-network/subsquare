import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export function useProfileAssetHubTabs() {
  const { id } = usePageProps();
  const maybeEvmAddress = tryConvertToEvmAddress(id);
  const prefix = `/assethub/user/${maybeEvmAddress}/`;

  return [
    {
      value: "assets",
      label: "Assets",
      url: `${prefix}assets`,
      exactMatch: false,
    },
  ];
}
