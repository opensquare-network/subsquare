import MultisigManageNotification from "./notifications/multisigManage";
import ExtensionUpdateNotification from "./notifications/extensionUpdate";

export default function GlobalNotification() {
  return (
    <>
      <ExtensionUpdateNotification />
      <MultisigManageNotification />
    </>
  );
}
