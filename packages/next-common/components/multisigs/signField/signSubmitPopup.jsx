import { useCallback, useEffect, useState, useMemo } from "react";
import Loading from "next-common/components/loading";
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
  sortSignatories,
  fetchMultisigList10Times,
  fetchMultisigsCount10Times,
} from "../common";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import { useChain } from "next-common/context/chain";
import SignSubmitPopupContent from "./signSubmitPopupContent";
import useCallFromHex from "next-common/utils/hooks/useCallFromHex";

export function SignSubmitInnerPopup({
  onClose,
  onCreated = noop,
  multisig = {},
  toggleDisabled,
}) {
  const api = useContextApi();
  const address = useRealAddress();
  const isLoading = !api;
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

  const isSubmitBtnDisabled = useMemo(() => {
    if (callHex) {
      return isLoadingRawCall || !maxWeight;
    }

    return !call || !maxWeight;
  }, [callHex, call, maxWeight, isLoadingRawCall]);

  useEffect(() => {
    if (isLoadingRawCall) {
      return;
    }
    setCall(rawCall);
  }, [rawCall, isLoadingRawCall]);

  const setValue = useCallback(
    ({ isValid, data }) => {
      if (!api || !isValid) {
        setCall(null);
        return;
      }

      if (data) {
        setCall(data.method);
      }
    },
    [api],
  );

  const getTxFunc = useCallback(() => {
    toggleDisabled(true);
    setIsSubmitBtnLoading(true);
    if (!api || !address || !call || !maxWeight) {
      return;
    }

    setIsSubmitBtnLoading(false);
    const otherSignatories = signatories.filter((item) => item !== address);

    const encodedTimepoint = api.createType("Timepoint", maybeTimepoint);

    return api.tx.multisig?.asMulti(
      threshold,
      sortSignatories(otherSignatories),
      encodedTimepoint,
      call,
      maxWeight,
    );
  }, [
    api,
    address,
    threshold,
    signatories,
    maybeTimepoint,
    call,
    maxWeight,
    toggleDisabled,
  ]);

  const onFinalized = () => {
    toggleDisabled(false);
    dispatch(newSuccessToast("Multisig status will be updated in seconds"));
    fetchMultisigList10Times(dispatch, chain, address, page).then(() => {
      // updated 10 time, do nothing
    });
    fetchMultisigsCount10Times(dispatch, chain, address).then(() => {
      // updated 10 time, do nothing
    });
  };

  return (
    <Popup
      className="!w-[640px]"
      title="Multisig"
      onClose={onClose}
      maskClosable={false}
    >
      <SignerWithBalance />
      {isLoading ? (
        <div className="flex justify-center">
          <Loading size={20} />
        </div>
      ) : (
        <SignSubmitPopupContent multisig={multisig} setValue={setValue} />
      )}
      <TxSubmissionButton
        disabled={isSubmitBtnDisabled}
        getTxFunc={getTxFunc}
        onFinalized={onFinalized}
        onClose={isEmptyFunc(onCreated) ? onClose : undefined}
        loading={isSubmitBtnLoading}
      />
    </Popup>
  );
}

export default function SignSubmitPopup({
  onClose,
  onCreated = noop,
  multisig = {},
  toggleDisabled,
}) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <SignSubmitInnerPopup
        onClose={onClose}
        onCreated={onCreated}
        multisig={multisig}
        toggleDisabled={toggleDisabled}
      />
    </SignerPopupWrapper>
  );
}
