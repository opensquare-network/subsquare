import Popup from "next-common/components/popup/wrapper/Popup";

export default function ExternalProposeDefaultPopup({ onClose }) {
  return (
    <Popup
      className="!w-[640px]"
      title="External propose default"
      onClose={onClose}
    ></Popup>
  );
}
