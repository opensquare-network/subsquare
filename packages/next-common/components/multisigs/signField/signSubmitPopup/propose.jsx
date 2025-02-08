import ProposeExtrinsicWithToggleTabs from "./tabs";
import ProposeTree from "./proposeTree";

export default function PopupPropose({ multisig, setValue }) {
  const { callHex, when, callHash } = multisig;

  return callHex ? (
    <ProposeTree callHex={callHex} when={when} />
  ) : (
    <ProposeExtrinsicWithToggleTabs
      setValue={setValue}
      callHash={callHash}
      when={when}
    />
  );
}
