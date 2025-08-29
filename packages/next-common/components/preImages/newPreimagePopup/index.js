import { useCallback, useMemo, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";
import Extrinsic from "next-common/components/extrinsic";
import PopupLabel from "next-common/components/popup/label";
import ExtrinsicInfo from "./info";
import { useDispatch } from "react-redux";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { noop } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithVotingBalance from "next-common/components/signerPopup/signerWithVotingBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { isEmptyFunc } from "next-common/utils/isEmptyFunc";
import { ExtrinsicLoading } from "next-common/components/popup/fields/extrinsicField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";

const EMPTY_HASH = blake2AsHex("0x");

const EMPTY_PROPOSAL = {
  encodedHash: EMPTY_HASH,
  encodedLength: 0,
  encodedProposal: "0x",
  notePreimageTx: null,
};

export function getState(api, proposal) {
  let encodedHash = EMPTY_HASH;
  let encodedProposal = "0x";
  let encodedLength = 0;
  let notePreimageTx = null;

  if (proposal) {
    encodedProposal = proposal.method.toHex();
    encodedLength = Math.ceil((encodedProposal.length - 2) / 2);
    encodedHash = blake2AsHex(encodedProposal);
    notePreimageTx = api.tx.preimage.notePreimage(encodedProposal);
  }

  return {
    encodedHash,
    encodedLength,
    encodedProposal,
    notePreimageTx,
  };
}

export function NewPreimageInnerPopup({ onCreated = noop }) {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const [
    { encodedHash, encodedLength, encodedProposal, notePreimageTx },
    setState,
  ] = useState(EMPTY_PROPOSAL);
  const disabled = !api || !notePreimageTx;
  const dispatch = useDispatch();

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

  let extrinsicComponent = null;

  if (!api) {
    extrinsicComponent = <ExtrinsicLoading />;
  } else {
    extrinsicComponent = (
      <div className="flex flex-col gap-4">
        <div>
          <PopupLabel text="Propose" />
          <Extrinsic
            defaultSectionName="system"
            defaultMethodName="setCode"
            setValue={setProposal}
          />
          <ExtrinsicInfo
            preimageHash={encodedHash}
            callData={encodedProposal}
            preimageLength={encodedLength || 0}
          />
        </div>
        <InsufficientBalanceTips byteLength={encodedLength} onlyPreimage />
      </div>
    );
  }

  return (
    <Popup title="New Preimage" onClose={onClose} maskClosable={false}>
      <SignerWithVotingBalance />
      {extrinsicComponent}
      <TxSubmissionButton
        disabled={disabled}
        getTxFunc={() => notePreimageTx}
        onInBlock={() => {
          onCreated(encodedHash, encodedLength);
          dispatch(incPreImagesTrigger());
        }}
        onFinalized={() => dispatch(incPreImagesTrigger())}
        autoClose={isEmptyFunc(onCreated)}
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

export function useNewPrerimageForm() {
  const api = useContextApi();
  const [
    { encodedHash, encodedLength, encodedProposal, notePreimageTx },
    setState,
  ] = useState(EMPTY_PROPOSAL);
  const [callState, setCallState] = useState();

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

  const extrinsicComponent = useMemo(() => {
    let extrinsicComponent = null;

    if (!api) {
      extrinsicComponent = <ExtrinsicLoading />;
    } else {
      extrinsicComponent = (
        <>
          <SignerWithBalance showTransferable supportedMultisig={false} />
          <div>
            <PopupLabel text="Pre-Propose" />
            <Extrinsic
              defaultCallState={callState}
              onCallStateChange={setCallState}
              defaultSectionName="system"
              defaultMethodName="setCode"
              setValue={setProposal}
            />
          </div>
          <ExtrinsicInfo
            preimageHash={encodedHash}
            callData={encodedProposal}
            preimageLength={encodedLength || 0}
          />
          <InsufficientBalanceTips byteLength={encodedLength} />
        </>
      );
    }

    return extrinsicComponent;
  }, [
    api,
    callState,
    encodedHash,
    encodedLength,
    encodedProposal,
    setProposal,
  ]);

  return {
    encodedHash,
    encodedLength,
    notePreimageTx,
    component: extrinsicComponent,
  };
}
