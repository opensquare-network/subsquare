import { useCallback, useState } from "react";
import Extrinsic from "next-common/components/extrinsic";
import PopupLabel from "next-common/components/popup/label";
import Loading from "next-common/components/loading";
import { noop } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { isEmptyFunc } from "next-common/utils/isEmptyFunc";
import { useMultisigContext } from "../multisigContext";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useWeight from "next-common/utils/hooks/common/useWeight";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { sortSignatories } from "../common";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

export function SignSubmitInnerPopup({
  onClose,
  onCreated = noop,
  multisig = {},
  toggleDisabled,
}) {
  const api = useContextApi();
  const address = useRealAddress();
  const isLoading = !api;
  const { setIsNeedReload, setIsRefetchCount } = useMultisigContext();
  const { threshold, signatories, when: maybeTimepoint } = multisig;
  const [encodedCall, setEncodedCall] = useState(null);
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [call, setCall] = useState(null);
  const { weight: maxWeight } = useWeight(call);
  const isSubmitBtnDisabled = !call || !maxWeight;
  const dispatch = useDispatch();

  const setValue = useCallback(
    ({ isValid, data }) => {
      if (!api || !isValid) {
        setCall(null);
        setEncodedCall(null);
        return;
      }

      if (data) {
        setCall(data);
        setEncodedCall(data.method);
      }
    },
    [api],
  );

  const getTxFunc = useCallback(() => {
    toggleDisabled(true);
    setIsSubmitBtnLoading(true);
    if (!api || !address || !encodedCall || !maxWeight) {
      return;
    }

    setIsSubmitBtnLoading(false);
    const otherSignatories = signatories.filter((item) => item !== address);

    const encodedTimepoint = api.createType("Timepoint", maybeTimepoint);

    return api.tx.multisig?.asMulti(
      threshold,
      sortSignatories(otherSignatories),
      encodedTimepoint,
      encodedCall,
      maxWeight,
    );
  }, [
    api,
    address,
    threshold,
    signatories,
    maybeTimepoint,
    encodedCall,
    maxWeight,
    toggleDisabled,
  ]);

  const onFinalized = () => {
    toggleDisabled(false);
    setIsNeedReload(true);
    setIsRefetchCount(true);
    dispatch(newSuccessToast("Multisig status will be updated in seconds"));
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
        <div>
          <PopupLabel text="Propose" />
          <Extrinsic
            defaultSectionName={defaultSectionName}
            defaultMethodName={defaultMethodName}
            setValue={setValue}
          />
        </div>
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
