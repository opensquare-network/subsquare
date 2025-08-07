import { useCallback, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useWeight from "next-common/utils/hooks/common/useWeight";
import { useChainSettings } from "next-common/context/chain";
import PopupPropose from "./propose";
import useCallFromHex, {
  useCallFromHexIndexer,
} from "next-common/utils/hooks/useCallFromHex";
import { sortAddresses } from "@polkadot/util-crypto";
import { isSameAddress } from "next-common/utils";
import MultisigSignProvider, { useMultisigSignContext } from "./context";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useMultisigListFetchFunc } from "../../actions/composeCallPopup/fetchMultisigList";

function SubmitPrompt() {
  return (
    <GreyPanel className="text14Medium text-textSecondary py-2.5 px-4 max-w-full">
      Approve this multisig and it will be get executed.
    </GreyPanel>
  );
}

export function SignSubmitInnerPopup({ onClose, multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: maybeTimepoint, callHex } = multisig;

  const { formType, setFormType, callDataMap, setCallData } =
    useMultisigSignContext();
  const { callData: call, isValid } = callDataMap[formType] || {};

  const { call: rawCall, isLoading: isLoadingRawCall } =
    useCallFromHex(callHex);

  const { state, isLoading: isWeightLoading } = useWeight(call);
  const { weight: maxWeight } = state;

  const { ss58Format } = useChainSettings();
  const fetchMultisigListFunc = useMultisigListFetchFunc();

  // call tree popup with callHex
  useEffect(() => {
    if (!setFormType || !setCallData || !callHex || isLoadingRawCall) {
      return;
    }

    setFormType("tree");
    setCallData("tree", { callData: rawCall, isValid: true });
  }, [callHex, rawCall, isLoadingRawCall, setFormType, setCallData]);

  const isLoading = isLoadingRawCall || isWeightLoading;

  const getTxFunc = useCallback(() => {
    if (!api || !address || !call || !isValid) {
      return;
    }

    const otherSignatories = signatories.filter(
      (item) => !isSameAddress(item, address),
    );

    const encodedTimepoint = api.createType("Timepoint", maybeTimepoint);

    return api.tx.multisig?.asMulti(
      threshold,
      sortAddresses(otherSignatories, ss58Format),
      encodedTimepoint,
      call,
      maxWeight,
    );
  }, [
    api,
    address,
    threshold,
    signatories,
    ss58Format,
    maybeTimepoint,
    call,
    isValid,
    maxWeight,
  ]);

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance noSwitchSigner />
      <PopupPropose />
      <SubmitPrompt />
      <TxSubmissionButton
        disabled={isLoading || !isValid}
        getTxFunc={getTxFunc}
        onFinalized={fetchMultisigListFunc}
      />
    </Popup>
  );
}

export default function SignSubmitPopup({ onClose, multisig = {} }) {
  const indexer = useCallFromHexIndexer(multisig?.when?.height);

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <SignerPopupWrapper onClose={onClose}>
        <MultisigSignProvider multisig={multisig}>
          <SignSubmitInnerPopup onClose={onClose} multisig={multisig} />
        </MultisigSignProvider>
      </SignerPopupWrapper>
    </MigrationConditionalApiProvider>
  );
}
