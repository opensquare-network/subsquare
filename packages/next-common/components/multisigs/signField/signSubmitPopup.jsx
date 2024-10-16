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

const defaultSectionName = "system";
const defaultMethodName = "setCode";

export function SignSubmitInnerPopup({
  onClose,
  onCreated = noop,
  multisig = {},
}) {
  const api = useContextApi();
  const address = useRealAddress();
  const isLoading = !api;
  const { setIsNeedReload } = useMultisigContext();
  const { threshold, signatories, when: maybeTimepoint } = multisig;
  const [encodedCall, setEncodedCall] = useState(null);
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [proposal, setProposal] = useState(null);
  const { weight: maxWeight } = useWeight(proposal);
  const isSubmitBtnDisabled = !proposal || !maxWeight;

  const setValue = useCallback(
    ({ isValid, data }) => {
      if (!api || !isValid) {
        setProposal(null);
        setEncodedCall(null);
        return;
      }

      if (data) {
        setProposal(data);
        setEncodedCall(data.method);
      }
    },
    [api],
  );

  const getTxFunc = useCallback(() => {
    setIsSubmitBtnLoading(true);
    if (!api || !address || !encodedCall || !maxWeight) {
      return;
    }

    setIsSubmitBtnLoading(false);
    const otherSignatories = signatories.filter((item) => item !== address);

    console.log(":::::encodedCall", encodedCall);

    return api.tx.multisig?.asMulti(
      threshold,
      otherSignatories,
      maybeTimepoint,
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
  ]);

  const onInBlock = () => {
    setIsNeedReload(true);
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
        onInBlock={onInBlock}
        onFinalized={onInBlock}
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
