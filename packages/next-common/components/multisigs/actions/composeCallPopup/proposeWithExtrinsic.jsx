import { ExtrinsicFieldWithLoading } from "next-common/components/popup/fields/extrinsicField";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useCallback, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { blake2AsHex } from "@polkadot/util-crypto";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

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
  const api = useContextApi();
  const [callHash, setCallHash] = useState(null);
  const [extrinsic, setExtrinsic] = useState(null);

  const setValue = useCallback(
    ({ isValid, data }) => {
      if (!api || !isValid) {
        setExtrinsic(null);
        setCallHash(null);
        return;
      }

      if (data) {
        const encodedProposal = data.method.toHex();
        const encodedHash = blake2AsHex(encodedProposal);
        setCallHash(encodedHash);
        setExtrinsic(data);
      }
    },
    [api],
  );

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
          disabled={!extrinsic}
          title="Propose"
          getTxFunc={getTxFunc}
        />
      </div>
    </div>
  );
}
