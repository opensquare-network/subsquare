import ProposeExtrinsicWithToggleTabs from "./tabs";
import ProposeTree from "./proposeTree";
import { useMultisigSignContext } from "./context";

export default function PopupPropose() {
  const {
    multisig: { callHex },
  } = useMultisigSignContext();

  return callHex ? <ProposeTree /> : <ProposeExtrinsicWithToggleTabs />;
}
