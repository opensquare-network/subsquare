import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useWeight from "next-common/utils/hooks/common/useWeight";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMultisigList10Times,
  fetchMultisigsCount10Times,
} from "../../common";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import { useChain, useChainSettings } from "next-common/context/chain";
import PopupPropose from "./propose";
import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import { sortAddresses } from "@polkadot/util-crypto";
import { isSameAddress } from "next-common/utils";
import MultisigSignProvider, { useMultisigSignContext } from "./context";

export function SignSubmitInnerPopup({ onClose, multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: maybeTimepoint, callHex } = multisig;
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);

  const { formType, setFormType, callDataMap, setCallData } =
    useMultisigSignContext();
  const { callData: call, isValid } = callDataMap[formType] || {};

  const dispatch = useDispatch();
  const myMultisigs = useSelector(myMultisigsSelector);
  const { page = 1 } = myMultisigs || {};
  const chain = useChain();
  const { call: rawCall, isLoading: isLoadingRawCall } = useCallFromHex(
    callHex,
    maybeTimepoint?.height,
  );
  const { weight: maxWeight } = useWeight(call);
  const { ss58Format } = useChainSettings();

  // call tree popup with callHex
  useEffect(() => {
    if (!setFormType || !setCallData || !callHex || isLoadingRawCall) {
      return;
    }

    setFormType("tree");
    setCallData("tree", { callData: rawCall, isValid: true });
  }, [callHex, rawCall, isLoadingRawCall, setFormType, setCallData]);

  const getTxFunc = useCallback(() => {
    setIsSubmitBtnLoading(true);
    if (!api || !address || !call || !maxWeight || !isValid) {
      return;
    }

    setIsSubmitBtnLoading(false);
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
    maxWeight,
    isValid,
  ]);

  const onFinalized = () => {
    dispatch(newSuccessToast("Multisig status will be updated in seconds"));
    fetchMultisigList10Times(dispatch, chain, address, page).then(() => {
      // updated 10 time, do nothing
    });
    fetchMultisigsCount10Times(dispatch, chain, address).then(() => {
      // updated 10 time, do nothing
    });
  };

  return (
    <Popup title="Multisig" onClose={onClose} maskClosable={false}>
      <SignerWithBalance />
      <PopupPropose />
      <TxSubmissionButton
        disabled={!isValid}
        getTxFunc={getTxFunc}
        onFinalized={onFinalized}
        loading={isSubmitBtnLoading}
      />
    </Popup>
  );
}

export default function SignSubmitPopup({ onClose, multisig = {} }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <MultisigSignProvider multisig={multisig}>
        <SignSubmitInnerPopup onClose={onClose} multisig={multisig} />
      </MultisigSignProvider>
    </SignerPopupWrapper>
  );
}
