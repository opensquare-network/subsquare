import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";
import { useMultisigSignContext } from "./context";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { InvalidCallPrompt } from "./proposeWithInputHex";
import { useMemo } from "react";

const defaultSectionName = "system";
const defaultMethodName = "setCode";

function CallHash({ callHash }) {
  if (!callHash) {
    return null;
  }

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-2">
        Call Hash
      </TitleContainer>
      <GreyPanel className="justify-start break-all gap-x-2 text14Medium text-textPrimary py-2.5 px-4 max-w-full">
        {callHash}
      </GreyPanel>
    </div>
  );
}

export default function ProposeWithExtrinsic() {
  const {
    setValue,
    callHash,
    multisig: { callHash: originalCallHash },
  } = useMultisigSignContext();

  const isCallNotMatch = useMemo(() => {
    return callHash !== originalCallHash && callHash;
  }, [callHash, originalCallHash]);

  return (
    <div className="flex flex-col space-y-4">
      <ExtrinsicFieldWithLoading
        label="Propose"
        defaultSectionName={defaultSectionName}
        defaultMethodName={defaultMethodName}
        setValue={setValue}
      />
      <CallHash callHash={callHash} />
      {isCallNotMatch && <InvalidCallPrompt content="Invalid call" />}
    </div>
  );
}
