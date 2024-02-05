import PopupLabel from "next-common/components/popup/label";
import { Input } from "next-common/components/gov2/referendum/metadata/styled";
import React from "react";

export default function ReferendumIndexRow({ referendumIndex }) {
  return (
    <div>
      <PopupLabel text="Referendum Index" />
      <div>
        <Input disabled={true} value={referendumIndex} />
      </div>
    </div>
  );
}
