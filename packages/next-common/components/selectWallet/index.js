import Popup from "../popup/wrapper/Popup";
import Content from "./content";

export default function SelectWalletPopup(props = {}) {
  return (
    <Popup wide {...props} className="!p-12 max-sm:!p-6 !w-[640px]">
      <Content />
    </Popup>
  );
}
