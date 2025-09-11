import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";

export default function DelegatePopup({
  defaultTargetAddress,
  targetDisabled,
  ...props
}) {
  return (
    <PopupWithSigner title="Delegate" {...props}>
      <PopupContent
        defaultTargetAddress={defaultTargetAddress}
        targetDisabled={targetDisabled}
      />
    </PopupWithSigner>
  );
}
