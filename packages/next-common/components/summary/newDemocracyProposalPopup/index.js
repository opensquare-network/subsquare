import { useCallback, useEffect, useState } from "react";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import SubmissionDeposit from "./submissionDeposit";
import LockedBalance from "./lockedBalance";
import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import { isValidPreimageHash } from "next-common/utils";
import usePreimageLength from "next-common/hooks/usePreimageLength";
import PreimageField from "../newProposalPopup/preimageField";
import { useContextApi } from "next-common/context/api";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

export function NewDemocracyProposalInnerPopup({
  preimageHash: _preimageHash,
  preimageLength: _preimageLength,
}) {
  const { onClose } = usePopupParams();
  const router = useRouter();
  const api = useContextApi();
  const { decimals } = useChainSettings();
  const [deposit, setDeposit] = useState("0");
  const [lockedBalance, setLockedBalance] = useState("0");
  const [preimageHash, setPreimageHash] = useState(_preimageHash || "");
  const [preimageLength, setPreimageLength] = useState(_preimageLength || "");

  useEffect(() => {
    if (!api) {
      return;
    }
    const deposit = new BigNumber(api?.consts.democracy?.minimumDeposit || 0)
      .div(Math.pow(10, decimals))
      .toString();

    setDeposit(deposit);
    setLockedBalance(deposit);
  }, [api, decimals]);

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

    const value = new BigNumber(lockedBalance || 0)
      .times(Math.pow(10, decimals))
      .toString();

    return api.tx.democracy.propose(
      {
        Lookup: {
          hash: preimageHash,
          len: parseInt(preimageLength),
        },
      },
      value,
    );
  }, [api, preimageHash, preimageLength, lockedBalance, decimals]);

  const disabled = !preimageHash || !isValidPreimageHash(preimageHash);

  return (
    <Popup wide title="New Proposal" className="!w-[640px]" onClose={onClose}>
      <SignerWithBalance />
      <PreimageField
        preimageHash={preimageHash}
        setPreimageHash={setPreimageHash}
        preimageLength={preimageLength}
        setPreimageLength={preimageLength}
      />
      <LockedBalance
        lockedBalance={lockedBalance}
        setLockedBalance={setLockedBalance}
      />
      <SubmissionDeposit deposit={deposit} />{" "}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        disabled={disabled}
        onInBlock={({ events }) => {
          const eventData = getEventData(events, "democracy", "Proposed");
          if (!eventData) {
            return;
          }
          const [proposalIndex] = eventData;
          router.push(`/democracy/proposals/${proposalIndex}`);
        }}
      />
    </Popup>
  );
}
