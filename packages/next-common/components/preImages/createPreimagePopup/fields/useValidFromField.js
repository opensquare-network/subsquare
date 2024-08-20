import ValidFromField from "next-common/components/popup/fields/validFromField";
import { useState } from "react";

export default function useValidFromField() {
  const [validFrom, setValidFrom] = useState("");

  return {
    value: validFrom || 'None',
    component: (
      <ValidFromField
        title="Valid From"
        value={validFrom}
        setValue={setValidFrom}
      />
    ),
  };
}
