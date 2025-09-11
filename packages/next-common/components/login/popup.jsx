import dynamicPopup from "next-common/lib/dynamic/popup";
import Login from ".";

const Popup = dynamicPopup(() => import("../popup/wrapper/Popup"));

/**
 * @param {Parameters<Popup>[0]} props
 */
export default function LoginPopup(props = {}) {
  return (
    <Popup {...props} className="!p-12 max-sm:!p-6">
      <Login />
    </Popup>
  );
}
