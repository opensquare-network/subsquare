import Popup from "../popup/wrapper/Popup";
import { usePopupParams } from "./context/params";

export default function ContextPopup({ children }) {
  const props = usePopupParams();
  return <Popup {...props}>{children}</Popup>;
}
