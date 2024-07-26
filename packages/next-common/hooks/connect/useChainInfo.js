import { useEffect, useState } from "react";
import { getSpecTypes } from "@polkadot/types-known";
import { formatBalance, isNumber } from "@polkadot/util";
import { base64Encode } from "@polkadot/util-crypto";
import { defaults as addressDefaults } from "@polkadot/util-crypto/address/defaults";
import { useContextApi } from "next-common/context/api";

export default function useChainInfo() {
  const api = useContextApi();
  const [chainInfo, setChainInfo] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    const DEFAULT_DECIMALS = api.registry.createType("u32", 12);
    const DEFAULT_SS58 = api.registry.createType("u32", addressDefaults.prefix);
    const isEthereum = api.registry.chainIsEthereum;

    api.rpc.system.chain().then((systemChain) => {
      const chainInfo = {
        chain: systemChain,
        chainType: isEthereum ? "ethereum" : "substrate",
        genesisHash: api.genesisHash.toHex(),
        icon: "polkadot",
        metaCalls: base64Encode(api.runtimeMetadata.asCallsOnly.toU8a()),
        specVersion: api.runtimeVersion.specVersion.toNumber(),
        ss58Format: isNumber(api.registry.chainSS58)
          ? api.registry.chainSS58
          : DEFAULT_SS58.toNumber(),
        tokenDecimals: (api.registry.chainDecimals || [
          DEFAULT_DECIMALS.toNumber(),
        ])[0],
        tokenSymbol: (api.registry.chainTokens ||
          formatBalance.getDefaults().unit)[0],
        types: getSpecTypes(
          api.registry,
          systemChain,
          api.runtimeVersion.specName,
          api.runtimeVersion.specVersion,
        ),
      };

      setChainInfo(chainInfo);
    });
  }, [api]);

  return chainInfo;
}
