import Extrinsic from "next-common/components/extrinsic";
import PopupLabel from "next-common/components/popup/label";
import SignerPopup from "next-common/components/signerPopup";

export default function NewPreimagePopup({ onClose }) {
  return (
    <SignerPopup title="New Preimage" onClose={onClose}>
      <div>
        <PopupLabel text="Propose" />
        <Extrinsic />
      </div>
    </SignerPopup>
  );
}
