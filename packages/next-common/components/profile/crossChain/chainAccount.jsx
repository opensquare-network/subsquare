import ChainIcon from "next-common/components/header/chainIcon";
import ExternalLink from "next-common/components/externalLink";
import AddressUser from "next-common/components/user/addressUser";
import capitalize from "next-common/utils/capitalize";
import { getChainSettingsPolyfill } from "next-common/utils/consts/settingsPolyfill";
import { getParachainChain } from "next-common/utils/xcm/parachains";
import { cn } from "next-common/utils";

const EXTRA_CHAIN_LABELS = {
  "urn:ocn:ethereum:1": "Ethereum Mainnet",
  "urn:ocn:ethereum:11155111": "Ethereum Sepolia",
  "urn:ocn:ethereum:42220": "Celo",
  "urn:ocn:ethereum:8453": "Base",
  "urn:ocn:ethereum:42161": "Arbitrum",
  "urn:ocn:ethereum:10": "Optimism",
  "urn:ocn:ethereum:56": "BNB Chain",
  "urn:ocn:ethereum:137": "Polygon",
  "urn:ocn:ethereum:43114": "Avalanche",
  "urn:ocn:ethereum:250": "Fantom",
  "urn:ocn:ethereum:1666600000": "Harmony",
  "urn:ocn:ethereum:222222": "Hydration EVM",
  "urn:ocn:sui:0x35834a8a": "Sui",
  "urn:ocn:solana:101": "Solana",
  "urn:ocn:aptos:1": "Aptos",
  "urn:ocn:wormhole:1": "Wormhole",
};

function getChainInfo(chainId) {
  if (!chainId) {
    return { chain: null, label: null };
  }

  const [, , ecosystem = "", chainIdNumber = ""] = chainId.split(":");
  if (!ecosystem || !chainIdNumber) {
    return { chain: null, label: chainId };
  }

  const knownChain = getParachainChain(ecosystem, chainIdNumber);
  if (knownChain) {
    return {
      chain: knownChain,
      label: getChainSettingsPolyfill(knownChain).name,
    };
  }

  const extraLabel = EXTRA_CHAIN_LABELS[chainId];
  if (extraLabel) {
    return { chain: null, label: extraLabel };
  }

  const suffix = chainIdNumber === "0" ? "" : ` ${chainIdNumber}`;
  return {
    chain: null,
    label: `${capitalize(ecosystem)}${suffix}`,
  };
}

export default function ChainAccount({ chain, address, xcscanUrl }) {
  const shouldRenderAddress =
    typeof address === "string" && !address.startsWith("urn");
  const { chain: projectChain, label } = getChainInfo(chain);
  const chainContent = (
    <span className="inline-flex items-center gap-x-1 text14Medium h-6">
      {projectChain && (
        <ChainIcon chain={projectChain} className="!h-5 !w-5 shrink-0" />
      )}
      <span className="text-textPrimary">{label}</span>
    </span>
  );

  return (
    <div className={cn(shouldRenderAddress && "space-y-2")}>
      {xcscanUrl ? (
        <ExternalLink
          className="!text-textPrimary"
          externalIcon={false}
          href={xcscanUrl}
          title="View transaction on Xcscan"
        >
          {chainContent}
        </ExternalLink>
      ) : (
        chainContent
      )}
      {shouldRenderAddress && <AddressUser add={address} maxWidth={160} />}
    </div>
  );
}
