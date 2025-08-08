import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";
import { useCallback, useEffect, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import CallHash from "./callHash";
import { useSignerContext } from "next-common/components/popupWithSigner/context";
import { useTimepoint } from "./useTimepoint";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

export default function ProposeWithExtrinsic() {
  const [callHash, setCallHash] = useState(null);
  const [extrinsic, setExtrinsic] = useState(null);
  const { setMultisig } = useSignerContext();

  const { timepoint, isTimepointLoading } = useTimepoint(callHash);

  useEffect(() => {
    if (isTimepointLoading) {
      return;
    }
    setMultisig((prev) => ({ ...prev, when: timepoint }));
  }, [setMultisig, timepoint, isTimepointLoading]);

  const setValue = useCallback(({ isValid, data }) => {
    if (!isValid || !data) {
      setExtrinsic(null);
      setCallHash(null);
      return;
    }

    const encodedProposal = data.method.toHex();
    const encodedHash = blake2AsHex(encodedProposal);
    setCallHash(encodedHash);
    setExtrinsic(data);
  }, []);

  const getTxFunc = useCallback(() => {
    return extrinsic;
  }, [extrinsic]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col space-y-4">
        <ExtrinsicFieldWithLoading
          label="Propose"
          defaultSectionName={defaultSectionName}
          defaultMethodName={defaultMethodName}
          setValue={setValue}
        />
        <CallHash callHash={callHash} />
      </div>
      <div className="flex justify-end">
        <TxSubmissionButton
          disabled={!extrinsic || isTimepointLoading}
          title="Propose"
          getTxFunc={getTxFunc}
        />
      </div>
    </div>
  );
}
