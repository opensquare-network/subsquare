import EditorField from "next-common/components/popup/fields/editorField";
import { useState } from "react";

export default function useRemarkField() {
  const [remark, setRemark] = useState("");

  return {
    value: remark,
    component: (
      <EditorField title="Remark" content={remark} setContent={setRemark} />
    ),
  };
}
