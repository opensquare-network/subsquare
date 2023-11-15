import { useCallback, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";
import { BN_ZERO } from "@polkadot/util";
import Extrinsic from "next-common/components/extrinsic";
import PopupLabel from "next-common/components/popup/label";
import SignerPopup from "next-common/components/signerPopup";
import ExtrinsicInfo from "./info";
import useApi from "next-common/utils/hooks/useApi";

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
  const [{ encodedHash, encodedLength }, setState] = useState(EMPTY_PROPOSAL);

  const setProposal = useCallback(
    (proposal) => {
      if (api) {
        return;
      }
      setState(getState(api, proposal));
    },
    [api],
  );

  return (
    <SignerPopup wide title="New Preimage" onClose={onClose}>
      <div>
        <PopupLabel text="Propose" />
        <Extrinsic
          defaultSectionName="system"
          defaultMethodName="setCode"
          onChange={setProposal}
        />
        <ExtrinsicInfo
          preimageHash={encodedHash}
          preimageLength={encodedLength || 0}
        />
      </div>
    </SignerPopup>
  );
}
