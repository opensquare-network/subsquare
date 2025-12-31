import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import PopupContent from "./content";

export default function ProposalsPopup({ title, onClose = noop, data }) {
  return (
    <Popup title={title} onClose={onClose}>
      <PopupContent data={data} />
    </Popup>
  );
}
