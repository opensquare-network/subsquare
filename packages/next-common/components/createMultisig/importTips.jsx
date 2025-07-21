import { usePopupParams } from "../popupWithSigner/context";

export default function ImportTips() {
  const { onOpenImportPopup } = usePopupParams();
  return (
    <>
      <div className="text-textSecondary text14Medium text-center">
        <span
          className="text-theme500 cursor-pointer"
          onClick={onOpenImportPopup}
          role="button"
        >
          Import
        </span>{" "}
        history multisig addresses from explorer API.
      </div>
    </>
  );
}
