import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";

export default function ProposeTree({ callHex, when }) {
  const { call, isLoading } = useCallFromHex(callHex, when?.height);
  return <CallTree call={call} isLoading={isLoading} />;
}
