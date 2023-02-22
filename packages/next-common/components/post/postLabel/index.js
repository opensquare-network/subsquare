import { useState } from "react";
import LabelSelect from "./labelSelect";
import { Label, LabelWrapper } from "../styled";
import styled from "styled-components";
import { p_12_normal } from "../../../styles/componentCss";

const Hint = styled.div`
  margin-top: 8px;
  ${p_12_normal}
  color: ${(p) => p.theme.textTertiary};
`;

export default function PostLabel({ selectedLabels, setSelectedLabels }) {
  return (
    <>
      <LabelWrapper>
        <Label>Label</Label>
      </LabelWrapper>
      <LabelSelect
        allLabels={["Treasury", "Democracy", "Council"]}
        maxSelect={2}
        selected={selectedLabels}
        setSelected={setSelectedLabels}
      />
      <Hint>* Maximum: 2 labels</Hint>
    </>
  );
}
