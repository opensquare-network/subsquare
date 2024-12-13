import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";
import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

function ProposeTree({ callHex, when }) {
  const { call, isLoading } = useCallFromHex(callHex, when?.height);
  return <CallTree call={call} isLoading={isLoading} />;
}

function ProposeExtrinsic({ setValue }) {
  return (
    <ExtrinsicFieldWithLoading
      label="Propose"
      defaultSectionName={defaultSectionName}
      defaultMethodName={defaultMethodName}
      setValue={setValue}
    />
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
