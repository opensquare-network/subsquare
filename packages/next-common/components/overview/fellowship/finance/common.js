import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { useAsync } from "react-use";

export const HOLLAR_FOREIGN_ASSET_KEY = {
  parents: 1,
  interior: {
    X2: [{ Parachain: 2034 }, { GeneralIndex: "222" }],
  },
};

export const HOLLAR_DECIMALS = SYMBOL_DECIMALS.HOLLAR;

export function useFetchHollarBalance(address) {
  const api = useAssetHubApi();

  const { loading, value } = useAsync(async () => {
    if (!api) {
      return;
    }

    const result = await api?.query?.foreignAssets?.account(
      HOLLAR_FOREIGN_ASSET_KEY,
      address,
    );

    return result?.toJSON()?.balance || "0";
  }, [api, address]);

  return { balance: value || "0", loading };
}

export function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="text12Medium text-textTertiary hover:underline"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
