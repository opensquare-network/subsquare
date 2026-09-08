import React, { useMemo, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import TextAreaField from "next-common/components/popup/fields/textAreaField";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import useAssetBalance from "next-common/hooks/treasury/useAssetBalance";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";
import BigNumber from "bignumber.js";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { stringToHex } from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";
import queryPreimageLen from "next-common/hooks/preimages/query/len";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";

function PopupContent() {
  const api = useConditionalContextApi();
  const router = useRouter();
  const { address, bountyIndex, assetKind } = useOnchainData();
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const assetInfo = useMemo(
    () => getAssetInfoFromAssetKind(assetKind, chainDecimals, chainSymbol),
    [assetKind, chainDecimals, chainSymbol],
  );
  const { symbol, decimals } = assetInfo;
  const { balance: transferrable, loading: isLoading } = useAssetBalance(
    address,
    assetInfo,
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    async (toastError) => {
      try {
        const value = new BigNumber(amount).times(Math.pow(10, decimals));
        if (!value.isFinite() || !value.isInteger() || !value.gt(0)) {
          throw new Error(
            "Child bounty value must be a positive amount with valid precision",
          );
        }
        if (isLoading || transferrable == null) {
          throw new Error("Available bounty balance is loading");
        }
        if (value.gt(transferrable))
          throw new Error(
            "Child bounty value must not be greater than available balance",
          );
        // The runtime converts the asset value to native units to check its minimum.
        if (!api?.tx.multiAssetBounties?.fundChildBounty) {
          throw new Error(
            "Creating multi-asset child bounties is not available",
          );
        }
        if (!description.trim()) {
          throw new Error("Description is required");
        }

        const metadata = stringToHex(description);
        const metadataHash = blake2AsHex(metadata);
        const preimageLen = await queryPreimageLen(api, metadataHash);
        const fundChildBounty = api.tx.multiAssetBounties.fundChildBounty(
          bountyIndex,
          value.toFixed(0),
          metadataHash,
          null,
        );

        if (preimageLen !== null) {
          return fundChildBounty;
        }

        return api.tx.utility.batchAll([
          api.tx.preimage.notePreimage(metadata),
          fundChildBounty,
        ]);
      } catch (error) {
        toastError(error.message);
        return null;
      }
    },
    [api, bountyIndex, amount, description, transferrable, decimals, isLoading],
  );
  return (
    <>
      <SignerWithBalance />
      <AmountInputWithHint
        label="Value"
        hintLabel="Available"
        hintTooltip="Available bounty balance"
        maxAmount={transferrable}
        decimals={decimals}
        symbol={symbol}
        isLoading={isLoading}
        inputAmount={amount}
        setInputAmount={setAmount}
      />
      <TextAreaField
        title="Description"
        placeholder="Please fill the description about this child bounty..."
        text={description}
        setText={setDescription}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton
        api={api}
        title="Confirm"
        getTxFunc={getTxFuncForSubmit}
        onInBlock={({ events }) => {
          const eventData = getEventData(
            events,
            "multiAssetBounties",
            "ChildBountyCreated",
          );
          if (eventData)
            router.push(
              `/treasury/multi-asset-child-bounties/${eventData[0]}_${eventData[1]}`,
            );
        }}
      />
    </>
  );
}

export default function NewChildBountyPopup({ onClose }) {
  return (
    <PopupWithSigner title="New Child Bounty" onClose={onClose}>
      <PopupContent />
    </PopupWithSigner>
  );
}
