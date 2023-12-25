import Popup from "../popup/wrapper/Popup";
import LoginContent from "./content";

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  const { initView } = props;
  return (
    <Popup wide {...props} className="!p-12 max-sm:!p-6">
      <LoginContent initView={initView} />
    </Popup>
  );
}
