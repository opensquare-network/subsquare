import { useCallback, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";
import { BN_ZERO } from "@polkadot/util";
import Extrinsic from "next-common/components/extrinsic";
import PopupLabel from "next-common/components/popup/label";
import SignerPopup from "next-common/components/signerPopup";
import ExtrinsicInfo from "./info";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Loading from "next-common/components/loading";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";

const EMPTY_HASH = blake2AsHex("");

const EMPTY_PROPOSAL = {
  encodedHash: EMPTY_HASH,
  encodedLength: 0,
  encodedProposal: null,
  notePreimageTx: null,
  storageFee: BN_ZERO,
};

function getState(api, proposal) {
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

export default function NewPreimagePopup({ onClose }) {
  const api = useApi();
  const [{ encodedHash, encodedLength, notePreimageTx }, setState] =
    useState(EMPTY_PROPOSAL);
  const disabled = !api || !notePreimageTx;
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doConfirm = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      const signerAddress = signerAccount.address;

      let tx = notePreimageTx;

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        setLoading: setIsSubmitting,
        dispatch,
        onClose,
        signerAddress,
        isMounted,
        onFinalized: () => dispatch(incPreImagesTrigger),
      });
    },
    [
      dispatch,
      isMounted,
      showErrorToast,
      onClose,
      setIsSubmitting,
      notePreimageTx,
    ],
  );

  return (
    <SignerPopup
      className="w-[640px]"
      title="New Preimage"
      onClose={onClose}
      maskClosable={false}
      disabled={disabled}
      isLoading={isSubmitting}
      actionCallback={doConfirm}
    >
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
    </SignerPopup>
  );
}
