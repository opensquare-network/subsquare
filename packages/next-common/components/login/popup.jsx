import Popup from "../popup/wrapper/Popup";
import LoginContent from "./content";

/**
 * @param {{showRegister: boolean} & Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  const { showRegister = true, ...rest } = props;

  return (
    <Popup wide {...rest} className="!p-12 max-sm:!p-6 !w-[640px]">
      <LoginContent showRegister={showRegister} />
    </Popup>
  );
}
