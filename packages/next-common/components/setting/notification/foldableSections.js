import React from "react";
import styled from "styled-components";
import { Label, Sections } from "./styled";
import Caret from "../../icons/caret";
import { useState } from "react";

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CaretWrapper = styled.div`
  cursor: pointer;
  margin-bottom: 16px;
`;

export default function FoldableSections({ children, title }) {
  const [fold, setFold] = useState(false);

  return (
    <div>
      <Title>
        <Label>{title}</Label>
        <CaretWrapper onClick={() => setFold(!fold)}>
          <Caret size={16} isGrey={true} down={fold} />
        </CaretWrapper>
      </Title>
      <Sections hide={fold}>{children}</Sections>
    </div>
  );
}
