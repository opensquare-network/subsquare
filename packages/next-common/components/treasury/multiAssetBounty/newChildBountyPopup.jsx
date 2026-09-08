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
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { stringToHex } from "@polkadot/util";
import { chainApiHash } from "next-common/utils/chain";
import queryPreimageLen from "next-common/hooks/preimages/query/len";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import Tab from "next-common/components/tab";
import Input from "next-common/lib/input";
import PopupLabel from "next-common/components/popup/label";
import { isValidPreimageHash } from "next-common/utils";

const metadataTabs = [
  { tabId: "text", tabTitle: "Text" },
  { tabId: "metadata", tabTitle: "Metadata Hash" },
];

function getCheckedValue({ amount, decimals, transferrable, isLoading }) {
  if (isLoading || transferrable == null) {
    throw new Error("Available bounty balance is loading");
  }

  return checkTransferAmount({
    transferAmount: amount,
    decimals,
    transferrable: String(transferrable),
  });
}

function getMetadata({ inputMode, description, inputMetadataHash }) {
  if (inputMode === "text") {
    if (!description.trim()) {
      throw new Error("Description is required");
    }
    const metadata = stringToHex(description);
    return { metadata, metadataHash: chainApiHash(metadata) };
  }

  const metadataHash = inputMetadataHash.trim();
  if (!isValidPreimageHash(metadataHash)) {
    throw new Error("Please enter a valid 32-byte metadata hash");
  }
  return { metadataHash };
}

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
  const [inputMode, setInputMode] = useState("text");
  const [inputMetadataHash, setInputMetadataHash] = useState("");
  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    async (toastError) => {
      try {
        const value = getCheckedValue({
          amount,
          decimals,
          transferrable,
          isLoading,
        });
        if (!api?.tx.multiAssetBounties?.fundChildBounty) {
          throw new Error(
            "Creating multi-asset child bounties is not available",
          );
        }
        const { metadata, metadataHash } = getMetadata({
          inputMode,
          description,
          inputMetadataHash,
        });

        const preimageLen = await queryPreimageLen(api, metadataHash);
        if (inputMode === "metadata" && preimageLen === null) {
          throw new Error("The metadata preimage must already exist on chain");
        }
        const fundChildBounty = api.tx.multiAssetBounties.fundChildBounty(
          bountyIndex,
          value,
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
    [
      api,
      bountyIndex,
      amount,
      description,
      inputMode,
      inputMetadataHash,
      transferrable,
      decimals,
      isLoading,
    ],
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
      <Tab
        tabs={metadataTabs}
        selectedTabId={inputMode}
        setSelectedTabId={setInputMode}
      />
      {inputMode === "text" ? (
        <TextAreaField
          title="Description"
          placeholder="Please fill the description about this child bounty..."
          text={description}
          setText={setDescription}
        />
      ) : (
        <div>
          <PopupLabel text="Metadata Hash" />
          <Input
            placeholder="0x..."
            value={inputMetadataHash}
            onChange={(event) => setInputMetadataHash(event.target.value)}
          />
          <p className="mt-2 text12Medium text-textTertiary">
            The metadata preimage must already exist on chain.
          </p>
        </div>
      )}
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
