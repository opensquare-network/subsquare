import ProposeExtrinsicWithToggleTabs from "./tabs";
import ProposeTree from "./proposeTree";
import { useMultisigSignContext } from "./context";

export default function PopupPropose() {
  const {
    multisig: { callHex, when },
  } = useMultisigSignContext();

  return callHex ? (
    <ProposeTree callHex={callHex} when={when} />
  ) : (
    <ProposeExtrinsicWithToggleTabs />
  );
}
