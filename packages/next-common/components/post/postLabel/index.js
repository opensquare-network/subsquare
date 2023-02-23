import React from "react";
import LabelSelect from "./labelSelect";
import { Label, LabelWrapper } from "../styled";
import styled from "styled-components";
import { p_12_normal } from "../../../styles/componentCss";
import { useChainSettings } from "../../../context/chain";
import uniq from "lodash.uniq";

const Hint = styled.div`
  margin-top: 8px;
  ${p_12_normal}
  color: ${(p) => p.theme.textTertiary};
`;

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
      <Hint>* Maximum: 2 labels</Hint>
    </>
  );
}
