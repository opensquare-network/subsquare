import Popup from "next-common/components/popup/wrapper/Popup";
import CallTree from "next-common/components/proposal/callTree";
import useCallFromHex from "next-common/utils/hooks/useCallFromHex";

export default function CallPopup({ callHex, blockHeight, setShow }) {
  const { call: rawCall, isLoading } = useCallFromHex(callHex, blockHeight);

  return (
    <Popup
      title="Call Detail"
      onClose={() => setShow(false)}
      className="w-[650px]"
    >
      <CallTree call={rawCall} isLoading={isLoading} />
    </Popup>
  );
}
