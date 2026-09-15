import { useEffect, useMemo, useState } from "react";
import { stringToHex } from "@polkadot/util";
import { isAddress } from "@polkadot/util-crypto";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { checkInputValue, isValidPreimageHash } from "next-common/utils";
import { chainApiHash } from "next-common/utils/chain";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import queryPreimageLen from "next-common/hooks/preimages/query/len";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import ErrorInfoPanel from "next-common/components/summary/styled/errorInfoPanel";
import EstimatedGas from "next-common/components/estimatedGas";
import NotePreimageButton from "../notePreimageButton";
import useFundBountyFields from "../fields/useFundBountyFields";
import ExtrinsicInfo from "../../newPreimagePopup/info";

const getAssetKindParam = (assetId) => {
  return {
    V4: {
      location: {
        parents: 0,
        interior: "Here",
      },
      assetId: {
        parents: 0,
        interior: {
          X2: [
            {
              PalletInstance: 50,
            },
            {
              GeneralIndex: assetId,
            },
          ],
        },
      },
    },
  };
};

async function preparePreimages(api, proposalState) {
  const { metadata, metadataHash, encodedHash, encodedLength, notePreimageTx } =
    proposalState;
  const [metadataLength, proposalLength] = await Promise.all([
    queryPreimageLen(api, metadataHash),
    queryPreimageLen(api, encodedHash),
  ]);

  if (metadataLength === null && !metadata) {
    throw new Error("The metadata preimage must already exist on chain");
  }

  const calls = [];
  if (metadataLength === null) {
    calls.push(api.tx.preimage.notePreimage(metadata));
  }
  if (proposalLength === null) {
    calls.push(notePreimageTx);
  }

  let tx = calls[0] || notePreimageTx;
  if (calls.length > 1) {
    tx = api.tx.utility.batchAll(calls);
  }

  return {
    notePreimageTx: tx,
    preimageExists: calls.length === 0,
    proposalByteLength: proposalLength === null ? encodedLength : 0,
  };
}

export function useFundBountyPreimages({
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
    encodedProposal: proposalState.encodedProposal,
    encodedLength: proposalState.encodedLength,
    error: proposalState.error || result.error,
  };
}

function PopupContent() {
  const { value: bountyParams, component: bountyFields } =
    useFundBountyFields();
  const {
    notePreimageTx,
    encodedLength,
    encodedProposal,
    encodedHash,
    proposalByteLength,
    preimageExists,
    error,
  } = useFundBountyPreimages(bountyParams);
  const createPreimagesTx = preimageExists ? null : notePreimageTx;

  return (
    <>
      <SignerWithBalance />
      {bountyFields}
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      {error && <ErrorInfoPanel>{error}</ErrorInfoPanel>}
      {preimageExists && (
        <p className="text12Medium text-textTertiary">
          The metadata and proposal preimages already exist on chain.
        </p>
      )}
      <InsufficientBalanceTips byteLength={proposalByteLength} preimageOnly />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={() => createPreimagesTx} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={createPreimagesTx} />
      </div>
    </>
  );
}

export default function FundMultiAssetBountyPopup() {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Create Multi-asset Bounty Proposal" onClose={onClose}>
      <PopupContent />
    </Popup>
  );
}
