import ProposeExtrinsicWithToggleTabs from "./tabs";
import ProposeTree from "./proposeTree";

export default function PopupPropose({ multisig, setValue }) {
  const { callHex, when } = multisig;

  return callHex ? (
    <ProposeTree callHex={callHex} when={when} />
  ) : (
    <ProposeExtrinsicWithToggleTabs
      setValue={setValue}
      callHex={callHex}
      when={when}
    />
  );
}
