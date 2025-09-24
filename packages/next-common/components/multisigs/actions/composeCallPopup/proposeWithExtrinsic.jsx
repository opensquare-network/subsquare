import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";
import { useCallback, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import CallHash from "./callHash";
import { useTimepoint } from "./useTimepoint";
import ErrorMessage from "next-common/components/styled/errorMessage";
import PreviousButton from "next-common/components/summary/newProposalButton/previousButton";
import { useStepContainer } from "next-common/context/stepContainer";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

export default function ProposeWithExtrinsic() {
  const [callHash, setCallHash] = useState(null);
  const [extrinsic, setExtrinsic] = useState(null);
  const { goBack } = useStepContainer();

  const { timepoint, isTimepointLoading } = useTimepoint(callHash);

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
        {timepoint && (
          <ErrorMessage>
            There is a same multisig on chain. Please confirm it.
          </ErrorMessage>
        )}
      </div>
      <div className="flex justify-between">
        <PreviousButton onClick={goBack} />
        <TxSubmissionButton
          disabled={!extrinsic || isTimepointLoading || timepoint}
          title="Propose"
          getTxFunc={getTxFunc}
        />
      </div>
    </div>
  );
}
