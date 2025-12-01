import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";
import { useMultisigSignContext } from "./context";
import { InvalidCallPrompt } from "./proposeWithInputHex";
import { useMemo, useCallback, useState } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import CallHash from "../../actions/composeCallPopup/callHash";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

export default function ProposeWithExtrinsic() {
  const api = useContextApi();
  const [callHash, setCallHash] = useState(null);

  const {
    setCallData,
    multisig: { callHash: originalCallHash },
  } = useMultisigSignContext();

  const isMatchCallHash = useMemo(
    () => originalCallHash === callHash,
    [originalCallHash, callHash],
  );

  const setValue = useCallback(
    ({ isValid, data } = {}) => {
      if (!api || !isValid || !setCallData) {
        setCallHash(null);
        return;
      }

      if (data) {
        const state = getState(api, data);
        setCallHash(state?.encodedHash);
      }

      setCallData("set", { callData: data, isValid: isMatchCallHash });
    },
    [api, isMatchCallHash, setCallData],
  );

  return (
    <div className="flex flex-col space-y-4">
      <ExtrinsicFieldWithLoading
        label="Propose"
        defaultSectionName={defaultSectionName}
        defaultMethodName={defaultMethodName}
        setValue={setValue}
      />
      <CallHash callHash={callHash} />
      {!isMatchCallHash && callHash && originalCallHash && (
        <InvalidCallPrompt content="Invalid call" />
      )}
    </div>
  );
}
