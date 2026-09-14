import { useEffect, useMemo, useState } from "react";
import { stringToHex } from "@polkadot/util";
import { isAddress } from "@polkadot/util-crypto";
import { useContextApi } from "next-common/context/api";
import { checkInputValue, isValidPreimageHash } from "next-common/utils";
import { chainApiHash } from "next-common/utils/chain";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { getAssetKindParam } from "next-common/components/preImages/createPreimagePopup/templates/batchTreasurySpendPopup";
import preparePreimages from "./preparePreimages";

export default function useFundBountyPreimages({
  symbol,
  inputBalance,
  curator,
  inputMode,
  description,
  inputMetadataHash,
}) {
  const api = useContextApi();
  const proposalState = useMemo(() => {
    if (!api) {
      return {};
    }
    if (!api.tx.multiAssetBounties?.fundBounty) {
      return { error: "Funding multi-asset bounties is not available" };
    }
    if (!inputBalance || !curator) {
      return {};
    }

    try {
      if (!isAddress(curator)) {
        throw new Error("Please enter a valid curator address");
      }
      const asset = getAssetBySymbol(symbol);
      if (!asset || !["USDT", "USDC"].includes(symbol)) {
        throw new Error("Invalid asset");
      }
      const value = checkInputValue(inputBalance, asset.decimals);

      let metadata;
      let metadataHash;
      if (inputMode === "text") {
        if (!description.trim()) {
          return {};
        }
        metadata = stringToHex(description);
        metadataHash = chainApiHash(metadata);
      } else {
        metadataHash = inputMetadataHash.trim();
        if (!metadataHash) {
          return {};
        }
        if (!isValidPreimageHash(metadataHash)) {
          throw new Error("Please enter a valid 32-byte metadata hash");
        }
      }

      const proposal = api.tx.multiAssetBounties.fundBounty(
        getAssetKindParam(asset.id),
        value.toFixed(),
        curator,
        metadataHash,
      );
      return { ...getState(api, proposal), metadata, metadataHash };
    } catch (error) {
      return { error: error.message };
    }
  }, [
    api,
    symbol,
    inputBalance,
    curator,
    inputMode,
    description,
    inputMetadataHash,
  ]);

  const [prepared, setPrepared] = useState();
  useEffect(() => {
    if (!proposalState.notePreimageTx) {
      return;
    }
    let isActive = true;
    async function prepare() {
      let result;
      try {
        result = await preparePreimages(api, proposalState);
      } catch (error) {
        result = { error: error.message };
      }
      if (isActive) {
        setPrepared({ proposalState, result });
      }
    }
    void prepare();
    return () => {
      isActive = false;
    };
  }, [api, proposalState]);

  const isPrepared = prepared?.proposalState === proposalState;
  const result = isPrepared ? prepared.result : {};
  return {
    ...result,
    encodedHash: proposalState.encodedHash,
    encodedLength: proposalState.encodedLength,
    error: proposalState.error || result.error,
    isPreparing: !!proposalState.notePreimageTx && !isPrepared,
  };
}
