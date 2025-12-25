import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import CuratorContent from "./content";

export default function CuratorProposalsPopup({ onClose = noop, data }) {
  return (
    <Popup title="Curator Proposals" onClose={onClose}>
      <CuratorContent data={data} />
    </Popup>
  );
}
