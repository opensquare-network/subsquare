import { useCallback, useEffect, useState } from "react";
import { capitalize, startCase } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import { isValidPreimageHash } from "next-common/utils";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import PreimageField from "../../newProposalPopup/preimageField";

export default function ExternalProposeVoteThresholdPopup({
  method = "externalProposeMajority",
  onClose,
}) {
  const title = capitalize(startCase(method));
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

    return api.tx.democracy[method]({
      Lookup: {
        hash: preimageHash,
        len: parseInt(preimageLength),
      },
    });
  }, [api, preimageHash, preimageLength, method]);

  return (
    <Popup className="!w-[640px]" title={title} onClose={onClose}>
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
          dispatch(newSuccessToast(`${title} submitted`));
        }}
      />
    </Popup>
  );
}
