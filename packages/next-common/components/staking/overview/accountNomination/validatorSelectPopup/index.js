import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import ValidatorsList from "./validatorsList";
import { AddressUser } from "next-common/components/user";
import { SystemSubtract } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import { usePopupOnClose } from "next-common/context/popup";

function SelectedValidators({ nominees, setNominees }) {
  if (!nominees || nominees.length === 0) {
    return (
      <div className="text-textTertiary text14Medium">
        No validators selected, add from the list below.
      </div>
    );
  }

  return (
    <>
      <div className="text-textPrimary">
        Your nominations: {nominees?.length || 0}
        <span className="text-textTertiary"> / 16</span>
      </div>
      <div className="flex flex-wrap gap-2 w-full">
        {nominees.map((nominee) => (
          <div
            key={nominee}
            className="flex gap-2 items-center text-textPrimary text14Medium rounded-full px-2 py-1 border border-neutral300 bg-neutral100"
          >
            <AddressUser add={nominee} />
            <div
              role="button"
              className="cursor-pointer p-1 [&_svg_path]:stroke-textTertiary [&_svg_path]:hover:stroke-theme500"
              onClick={() =>
                setNominees((prev) => prev.filter((n) => n !== nominee))
              }
            >
              <SystemSubtract width={16} height={16} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ValidatorSelectPopupContent({ nominees, setNominees }) {
  const onClose = usePopupOnClose();
  return (
    <div className="flex flex-col gap-4 text14Medium">
      <SelectedValidators nominees={nominees} setNominees={setNominees} />
      <ValidatorsList nominees={nominees} setNominees={setNominees} />
      <div className="flex justify-end">
        <PrimaryButton onClick={onClose}>Confirm</PrimaryButton>
      </div>
    </div>
  );
}

export default function ValidatorSelectPopup({
  onClose,
  nominees,
  setNominees,
}) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Nomination List" onClose={onClose}>
        <ValidatorSelectPopupContent
          nominees={nominees}
          setNominees={setNominees}
        />
      </Popup>
    </SignerPopupWrapper>
  );
}
