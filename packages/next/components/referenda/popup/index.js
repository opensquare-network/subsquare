import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";

export default function Popup(props) {
  return (
    <PopupWithSigner title="Referendum vote" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
