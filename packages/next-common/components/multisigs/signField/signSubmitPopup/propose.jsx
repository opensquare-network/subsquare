import Extrinsic from "next-common/components/extrinsic";
import PopupLabel from "next-common/components/popup/label";
import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

function ProposeTree({ callHex, when }) {
  const { call, isLoading } = useCallFromHex(callHex, when?.height);
  return <CallTree call={call} isLoading={isLoading} />;
}

function ProposeExtrinsic({ setValue }) {
  return (
    <div>
      <PopupLabel text="Propose" />
      <Extrinsic
        defaultSectionName={defaultSectionName}
        defaultMethodName={defaultMethodName}
        setValue={setValue}
      />
    </div>
  );
}

export default function PopupPropose({ multisig, setValue }) {
  const { callHex, when } = multisig;
  return callHex ? (
    <ProposeTree callHex={callHex} when={when} />
  ) : (
    <ProposeExtrinsic setValue={setValue} />
  );
}
