import { useCallback, useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import Popup from "next-common/components/popup/wrapper/Popup";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import { isValidPreimageHash } from "next-common/utils";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PreimageField from "../newProposalPopup/preimageField";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

export default function ExternalProposeMajorityPopup({ onClose }) {
  const api = useContextApi();
  const dispatch = useDispatch();
  const [preimageHash, setPreimageHash] = useState("");
  const [preimageLength, setPreimageLength] = useState("");

  const disabled = !preimageHash || !isValidPreimageHash(preimageHash);

  const length = usePreimageLength(preimageHash);
  useEffect(() => {
    if (length) {
      setPreimageLength(length);
    }
  }, [length]);

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    return api.tx.democracy.externalProposeMajority({
      Lookup: {
        hash: preimageHash,
        len: parseInt(preimageLength),
      },
    });
  }, [api, preimageHash, preimageLength]);

  return (
    <Popup
      className="!w-[640px]"
      title="External propose majority"
      onClose={onClose}
    >
      <SignerWithBalance />
      <PreimageField
        preimageHash={preimageHash}
        setPreimageHash={setPreimageHash}
        preimageLength={preimageLength}
        setPreimageLength={preimageLength}
      />
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        disabled={disabled}
        onInBlock={() => {
          dispatch(newSuccessToast("External propose majority submitted"));
        }}
      />
    </Popup>
  );
}
