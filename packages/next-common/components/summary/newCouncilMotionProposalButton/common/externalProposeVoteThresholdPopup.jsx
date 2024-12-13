import { useCallback, useEffect, useState } from "react";
import { capitalize, startCase } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import { isValidPreimageHash } from "next-common/utils";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import PreimageField from "../../newProposalPopup/preimageField";
import CouncilProposeButton from "./councilProposeButton";
import Tooltip from "next-common/components/tooltip";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export default function ExternalProposeVoteThresholdPopup({
  isMember,
  method = "externalProposeMajority",
  threshold,
}) {
  const { onClose } = usePopupParams();
  const title = capitalize(startCase(method));
  const api = useContextApi();
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
    <Popup title={title} onClose={onClose}>
      <SignerWithBalance />
      <PreimageField
        preimageHash={preimageHash}
        setPreimageHash={setPreimageHash}
        preimageLength={preimageLength}
        setPreimageLength={preimageLength}
      />
      <div className="flex justify-end">
        <Tooltip
          content={
            !isMember ? "Only council members can create proposal" : null
          }
          className="inline"
        >
          <CouncilProposeButton
            threshold={threshold}
            disabled={disabled}
            getTxFunc={getTxFunc}
          />
        </Tooltip>
      </div>
    </Popup>
  );
}
