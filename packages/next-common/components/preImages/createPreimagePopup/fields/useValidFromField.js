import BlocksField from "next-common/components/popup/fields/blocksField";
import { useState } from "react";

export default function useValidFromField() {
  const [validFrom, setValidFrom] = useState("");

  return {
    value: validFrom,
    component: (
      <BlocksField
        title="Valid From"
        value={validFrom}
        setValue={setValidFrom}
      />
    ),
  };
}
