import Signer from "next-common/components/popup/fields/signerField";
import RadioOptionGroup, {
  RadioOptionGroupType,
} from "next-common/components/radioOptionGroup";
import PrimaryButton from "next-common/lib/button/primary";

import { useState } from "react";
export default function RequestJudgementPopupContent() {
  const [value, setValue] = useState("yes");
  return (
    <div className="flex flex-col gap-y-4">
      <Signer
        balance={0}
        isBalanceLoading={false}
        symbol="DOT"
        className="[& .label-text]:text14Bold"
      />

      <div className="text14Bold text-textPrimary">Select a Registrar</div>
      <RadioOptionGroup
        type={RadioOptionGroupType.REQUEST_JUDGEMENT}
        className="gap-y-3"
        options={[
          {
            label: "Yes",
            value: "yes",
            judgement: {
              index: 0,
              address: "13yib1rAjadXd1Hm3GuTNkWRq16U99PEQMExKbVqRRBNVMp",
              fee: "0 DOT",
              latestJudgement: new Date(),
            },
          },
          {
            label: "No",
            value: "no",
            judgement: {
              index: 1,
              address: "13yib1rAjadXd1Hm3GuTNkWRq16U99PEQMExKbVqRRBNVMp",
              fee: "0 DOT",
              latestJudgement: new Date(),
            },
          },
        ]}
        selected={value}
        setSelected={setValue}
      />
      <div className="flex justify-end">
        <PrimaryButton className="w-auto" onClick={() => {}}>
          Submit
        </PrimaryButton>
      </div>
    </div>
  );
}
