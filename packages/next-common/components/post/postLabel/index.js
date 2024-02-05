import React from "react";
import LabelSelect from "next-common/components/form/labelSelect";
import { Label, LabelWrapper } from "../styled";
import { useChainSettings } from "../../../context/chain";
import uniq from "lodash.uniq";

export default function PostLabel({ selectedLabels, setSelectedLabels }) {
  const setting = useChainSettings();
  const allLabels = uniq([
    ...(setting.postLabels || []),
    ...(selectedLabels || []),
  ]);

  if (allLabels.length === 0) {
    return null;
  }

  return (
    <>
      <LabelWrapper>
        <Label>Label</Label>
      </LabelWrapper>
      <LabelSelect
        allLabels={allLabels}
        maxSelect={2}
        selected={selectedLabels}
        setSelected={setSelectedLabels}
      />
      <div className="mt-2 text12Medium text-textTertiary">
        * Maximum: 2 labels
      </div>
    </>
  );
}
