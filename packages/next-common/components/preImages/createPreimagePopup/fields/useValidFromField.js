import ValidFromField from "next-common/components/popup/fields/validFromField";
import { useState } from "react";

export default function useValidFromField() {
  const [validFrom, setValidFrom] = useState("");

  const value = validFrom === "None" || validFrom === "" ? null : validFrom;

  return {
    value,
    component: (
      <ValidFromField
        title="Valid From"
        value={validFrom}
        setValue={setValidFrom}
      />
    ),
  };
}
