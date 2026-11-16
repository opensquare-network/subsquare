import React, { useState } from "react";
import { useMount } from "react-use";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import {
  useSignerAccount,
  useSignerContext,
} from "next-common/components/popupWithSigner/context";
import { wrapTxByRole } from "next-common/utils/sendTransaction/wrapTxByRole";
import { isSameAddress } from "next-common/utils/isSameAddress";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import TextAreaField from "next-common/components/popup/fields/textAreaField";
import { useOnchainData } from "next-common/context/post";
import { useContextApi } from "next-common/context/api";
import useMultiAssetBountyValueState from "next-common/hooks/treasury/multiAssetBounty/useMultiAssetBountyValueState";
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
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Tooltip from "next-common/components/tooltip";

const metadataTabs = [
  { tabId: "text", tabTitle: "Text" },
  { tabId: "metadata", tabTitle: "Metadata Hash" },
];

function getCheckedValue({ amount, decimals, available, isLoading }) {
  if (isLoading || available == null) {
    throw new Error("Available bounty value is loading");
  }

  return checkTransferAmount({
    transferAmount: amount,
    decimals,
    transferrable: available,
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

function UseConnectedAccountSigner() {
  const { setSelectedProxyAddress, setMultisig } = useSignerContext();

  useMount(() => {
    // The selected role is already wrapped by the transaction builder.
    setSelectedProxyAddress();
    setMultisig();
  });

  return null;
}

function PopupContent({ parentCurator, role }) {
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const connectedAddress =
    signerAccount?.proxyAddress || signerAccount?.address;
  const api = useContextApi();
  const router = useRouter();
  const { bountyIndex } = useOnchainData();
  // The pallet limits a child bounty to `value - ChildBountiesValuePerParent`,
  // which can be lower than the account balance when funds arrived on the
  // account without increase_value. Use that limit as "Available" so the form
  // cannot offer amounts the call would reject with InsufficientBountyValue.
  const {
    assetInfo,
    balance,
    available,
    loading: isLoading,
  } = useMultiAssetBountyValueState();
  const { symbol, decimals } = assetInfo ?? {};
  const hasUnregisteredFunds = !!(
    balance &&
    available != null &&
    balance.gt(available)
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [inputMode, setInputMode] = useState("text");
  const [inputMetadataHash, setInputMetadataHash] = useState("");
  const { value: childCurator, component: curatorField } = useAddressComboField(
    {
      title: (
        <span className="inline-flex items-center gap-1">
          Curator
          <Tooltip content="Optional. Defaults to the parent bounty curator." />
        </span>
      ),
    },
  );
  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    async (toastError) => {
      try {
        if (!role || !connectedAddress) {
          throw new Error("Select an authorized curator account");
        }
        const isDirectSigner =
          role.kind === "direct" &&
          isSameAddress(parentCurator, connectedAddress);
        const isProxySigner =
          role.kind === "proxy" && isSameAddress(role.proxy, connectedAddress);
        const isMultisigSigner =
          role.kind === "multisig" &&
          role.multisig?.signatories?.some((signatory) =>
            isSameAddress(signatory, connectedAddress),
          );
        if (!isDirectSigner && !isProxySigner && !isMultisigSigner) {
          throw new Error(
            "The connected account does not match the selected curator role",
          );
        }
        const value = getCheckedValue({
          amount,
          decimals,
          available,
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
          childCurator || null,
        );

        let tx = fundChildBounty;
        if (preimageLen === null) {
          tx = api.tx.utility.batchAll([
            api.tx.preimage.notePreimage(metadata),
            fundChildBounty,
          ]);
        }

        const wrappedTx = await wrapTxByRole(api, {
          role,
          tx,
          connectedAddress,
          origin: parentCurator,
        });
        if (!wrappedTx) {
          throw new Error("Unable to create the child bounty transaction");
        }
        return wrappedTx;
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
      childCurator,
      parentCurator,
      role,
      connectedAddress,
      available,
      decimals,
      isLoading,
    ],
  );
  return (
    <>
      <UseConnectedAccountSigner />
      <SignerWithBalance noSwitchSigner />
      <AmountInputWithHint
        label="Value"
        hintLabel="Available"
        hintTooltip="Recorded bounty value left after the values already used by child bounties"
        maxAmount={available?.toFixed() ?? "0"}
        decimals={decimals}
        symbol={symbol}
        isLoading={isLoading}
        inputAmount={amount}
        setInputAmount={setAmount}
      />
      {hasUnregisteredFunds && (
        <p className="mt-2 text12Medium text-textTertiary">
          The bounty account holds more than the recorded value allows. Use
          Increase Value to register the extra funds first.
        </p>
      )}
      {curatorField}
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
        title="Confirm"
        getTxFunc={getTxFuncForSubmit}
        onInBlock={({ events }) => {
          const eventData = getEventData(
            events,
            "multiAssetBounties",
            "ChildBountyCreated",
          );
          if (eventData) {
            router.push(
              `/treasury/multi-asset-child-bounties/${eventData[0]}_${eventData[1]}`,
            );
          } else if (
            role?.kind === "multisig" &&
            getEventData(events, "multisig", "NewMultisig")
          ) {
            dispatch(
              newSuccessToast(
                "Multisig transaction submitted. Waiting for other signatories.",
              ),
            );
          }
        }}
      />
    </>
  );
}

export default function NewChildBountyPopup({ onClose, parentCurator, role }) {
  return (
    <PopupWithSigner title="New Child Bounty" onClose={onClose}>
      <PopupContent parentCurator={parentCurator} role={role} />
    </PopupWithSigner>
  );
}
