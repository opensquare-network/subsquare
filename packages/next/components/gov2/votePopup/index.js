import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

function WithSignerAddress({ children }) {
  const signerAccount = useSignerAccount();
  if (!signerAccount?.realAddress) {
    return null;
  }

  return children;
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="Referendum vote" {...props}>
      <WithSignerAddress>
        <PopupContent />
      </WithSignerAddress>
    </PopupWithSigner>
  );
}
