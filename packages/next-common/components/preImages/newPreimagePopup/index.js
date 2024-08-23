import { useCallback, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";
import { BN_ZERO } from "@polkadot/util";
import Extrinsic from "next-common/components/extrinsic";
import PopupLabel from "next-common/components/popup/label";
import ExtrinsicInfo from "./info";
import { useDispatch } from "react-redux";
import Loading from "next-common/components/loading";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { noop } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { isEmptyFunc } from "next-common/utils/isEmptyFunc";

const EMPTY_HASH = blake2AsHex("");

const EMPTY_PROPOSAL = {
  encodedHash: EMPTY_HASH,
  encodedLength: 0,
  encodedProposal: null,
  notePreimageTx: null,
  storageFee: BN_ZERO,
};

export function getState(api, proposal) {
  let encodedHash = EMPTY_HASH;
  let encodedProposal = null;
  let encodedLength = 0;
  let notePreimageTx = null;
  let storageFee = BN_ZERO;

  if (proposal) {
    encodedProposal = proposal.method.toHex();
    encodedLength = Math.ceil((encodedProposal.length - 2) / 2);
    encodedHash = blake2AsHex(encodedProposal);
    notePreimageTx = api.tx.preimage.notePreimage(encodedProposal);

    // we currently don't have a constant exposed, however match to Substrate
    storageFee = (api.consts.preimage?.baseDeposit || BN_ZERO).add(
      (api.consts.preimage?.byteDeposit || BN_ZERO).muln(encodedLength),
    );
  }

  return {
    encodedHash,
    encodedLength,
    encodedProposal,
    notePreimageTx,
    storageFee,
  };
}

export function NewPreimageInnerPopup({ onClose, onCreated = noop }) {
  const api = useContextApi();
  const [{ encodedHash, encodedLength, notePreimageTx }, setState] =
    useState(EMPTY_PROPOSAL);
  const disabled = !api || !notePreimageTx;
  const dispatch = useDispatch();
  const isLoading = !api;

  const setProposal = useCallback(
    ({ isValid, data: tx }) => {
      if (!api) {
        return;
      }
      if (!isValid) {
        return setState(EMPTY_PROPOSAL);
      }
      const state = getState(api, tx);
      setState(state);
    },
    [api],
  );

  return (
    <Popup
      className="!w-[640px]"
      title="New Preimage"
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
            defaultSectionName="system"
            defaultMethodName="setCode"
            setValue={setProposal}
          />
          <ExtrinsicInfo
            preimageHash={encodedHash}
            preimageLength={encodedLength || 0}
          />
        </div>
      )}
      <TxSubmissionButton
        disabled={disabled}
        getTxFunc={() => notePreimageTx}
        onInBlock={() => {
          onCreated(encodedHash, encodedLength);
          dispatch(incPreImagesTrigger());
        }}
        onFinalized={() => dispatch(incPreImagesTrigger())}
        onClose={isEmptyFunc(onCreated) ? onClose : undefined}
      />
    </Popup>
  );
}

export default function NewPreimagePopup({ onClose, onCreated = noop }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <NewPreimageInnerPopup onClose={onClose} onCreated={onCreated} />
    </SignerPopupWrapper>
  );
}
