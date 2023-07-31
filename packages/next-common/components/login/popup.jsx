import Popup from "../popup/wrapper/Popup";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import LoginContent from "./content";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  const { loginPopupOpen, closeLoginPopup } = useLoginPopup();

  return (
    loginPopupOpen && (
      <Popup
        wide
        {...props}
        className="!p-12 max-sm:!p-6"
        onClose={closeLoginPopup}
      >
        <LoginContent />
      </Popup>
    )
  );
}
