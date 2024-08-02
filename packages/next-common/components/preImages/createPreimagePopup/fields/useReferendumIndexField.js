import ReferendumIndexField from "next-common/components/popup/fields/referendumIndexField";
import { useState } from "react";

export default function useReferendumIndexField({ title } = {}) {
  const [referendumIndex, setReferendumIndex] = useState("");

  return {
    value: referendumIndex,
    component: (
      <ReferendumIndexField
        title={title}
        value={referendumIndex}
        setValue={setReferendumIndex}
      />
    ),
  };
}
