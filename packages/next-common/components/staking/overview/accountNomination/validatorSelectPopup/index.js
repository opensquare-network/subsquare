import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Popup from "next-common/components/popup/wrapper/Popup";

function ValidatorSelectPopupContent({ nominations }) {
  return (
    <div className="flex flex-col gap-4 text14Medium">
      <div className="text-textPrimary">
        Your nominations: {nominations?.length || 0}/16
      </div>
    </div>
  );
}

export default function ValidatorSelectPopup({
  onClose,
  nominations,
  setNominations,
}) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Nomination List" onClose={onClose}>
        <ValidatorSelectPopupContent
          nominations={nominations}
          setNominations={setNominations}
        />
      </Popup>
    </SignerPopupWrapper>
  );
}
