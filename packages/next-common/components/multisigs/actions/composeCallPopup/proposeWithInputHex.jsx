import { useCallback, useState } from "react";
import Input from "next-common/lib/input";
import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";

export default function ProposeWithInputHex() {
  const api = useContextApi();
  const [inputHex, setInputHex] = useState("");
  const { call, isLoading } = useCallFromHex(inputHex);

  const getTxFunc = useCallback(() => {
    return api.tx(call);
  }, [api, call]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col space-y-2">
        <div className="text-textPrimary text14Bold">Call Hex</div>
        <Input
          placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
          value={inputHex}
          onChange={(e) => setInputHex(e.target.value)}
        />
        {inputHex && <CallTree call={call} isLoading={isLoading} />}
      </div>
      <div className="flex justify-end">
        <TxSubmissionButton
          disabled={!call}
          title="Propose"
          getTxFunc={getTxFunc}
        />
      </div>
    </div>
  );
}
