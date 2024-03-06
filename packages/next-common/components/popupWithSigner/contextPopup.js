import Popup from "../popup/wrapper/Popup";
import { usePopupParams } from "./context/params";

export default function ContextPopup({ children, ...props }) {
  const params = usePopupParams();
  return <Popup {...Object.assign({}, params, props)}>{children}</Popup>;
}
