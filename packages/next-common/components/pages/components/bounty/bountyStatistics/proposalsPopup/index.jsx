import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import PopupContent from "./content";

export default function ProposalsPopup({
  role,
  proposalOwner,
  onClose = noop,
  data,
}) {
  return (
    <Popup
      title={<span className="capitalize">{role} Proposals</span>}
      onClose={onClose}
    >
      <PopupContent data={data} proposalOwner={proposalOwner} role={role} />
    </Popup>
  );
}
