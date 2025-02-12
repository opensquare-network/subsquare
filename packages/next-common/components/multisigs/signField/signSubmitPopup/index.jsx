import { useCallback, useEffect, useMemo, useState } from "react";
import { noop } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { isEmptyFunc } from "next-common/utils/isEmptyFunc";
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
import MultisigSignProvider from "./context";
import { getState } from "next-common/components/preImages/newPreimagePopup";

export function SignSubmitInnerPopup({
  onClose,
  onCreated = noop,
  multisig = {},
}) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: maybeTimepoint, callHex } = multisig;
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [call, setCall] = useState(null);
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
  const [callHash, setCallHash] = useState(null);

  const isSubmitBtnDisabled = useMemo(() => {
    if (callHex) {
      return isLoadingRawCall || !maxWeight;
    }

    return !call || !maxWeight;
  }, [callHex, call, maxWeight, isLoadingRawCall]);

  useEffect(() => {
    if (callHex && !isLoadingRawCall) {
      setCall(rawCall);
    }
  }, [callHex, rawCall, isLoadingRawCall]);

  const setValue = useCallback(
    ({ isValid, data }) => {
      if (!api || !isValid) {
        setCall(null);
        setCallHash(null);
        return;
      }

      if (data) {
        const state = getState(api, data);
        setCallHash(state?.encodedHash);
        setCall(data.method);
      }
    },
    [api],
  );

  const getTxFunc = useCallback(() => {
    setIsSubmitBtnLoading(true);
    if (!api || !address || !call || !maxWeight) {
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
      <MultisigSignProvider
        multisig={multisig}
        setValue={setValue}
        callHash={callHash}
      >
        <PopupPropose />
        <TxSubmissionButton
          disabled={isSubmitBtnDisabled}
          getTxFunc={getTxFunc}
          onFinalized={onFinalized}
          autoClose={isEmptyFunc(onCreated)}
          loading={isSubmitBtnLoading}
        />
      </MultisigSignProvider>
    </Popup>
  );
}

export default function SignSubmitPopup({
  onClose,
  onCreated = noop,
  multisig = {},
}) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <SignSubmitInnerPopup
        onClose={onClose}
        onCreated={onCreated}
        multisig={multisig}
      />
    </SignerPopupWrapper>
  );
}
