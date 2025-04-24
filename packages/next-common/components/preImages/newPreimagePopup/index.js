import { useCallback, useMemo, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";
import { BN_ZERO } from "@polkadot/util";
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

export function NewPreimageInnerPopup({ onCreated = noop }) {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const [{ encodedHash, encodedLength, notePreimageTx }, setState] =
    useState(EMPTY_PROPOSAL);
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
  const [{ encodedHash, encodedLength, notePreimageTx }, setState] =
    useState(EMPTY_PROPOSAL);
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
          <SignerWithBalance />
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
            preimageLength={encodedLength || 0}
          />
        </>
      );
    }

    return extrinsicComponent;
  }, [api, callState, encodedHash, encodedLength, setProposal]);

  return {
    encodedHash,
    encodedLength,
    notePreimageTx,
    component: extrinsicComponent,
  };
}
