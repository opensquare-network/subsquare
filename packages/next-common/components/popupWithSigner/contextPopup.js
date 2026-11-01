import Popup from "../popup/wrapper/Popup";
import { usePopupParams } from "./context/params";
import ExtensionUpdatePrompt from "next-common/components/overview/accountInfo/components/extensionUpdatePrompt";

export default function ContextPopup({ children }) {
  const props = usePopupParams();

  return (
    <Popup {...props}>
      {/* Sits above every field: the reminder is about the extension that will sign this
          transaction, so it must not ride along with whichever field happens to be rendered
          first. It renders nothing unless an update is actually needed. */}
      <ExtensionUpdatePrompt isWithCache={false} />
      {children}
    </Popup>
  );
}
