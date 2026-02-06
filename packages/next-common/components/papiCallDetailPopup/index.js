import PapiCallTreeView from "../papiCallTreeView";
import Popup from "../popup/wrapper/Popup";
import { getPapiCallTree } from "./getPapiCallTree";

export default function PapiCallDetailPopup({ setShow }) {
  const proposal = getPapiCallTree();
  return (
    <Popup setShow={setShow} title="PAPI Call Detail">
      <PapiCallTreeView proposal={proposal} />
    </Popup>
  );
}
