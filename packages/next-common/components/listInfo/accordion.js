import React, { memo, useState } from "react";
import styled from "styled-components";
import Caret from "../icons/caret";
import { PrimaryCard } from "../styled/containers/primaryCard";
import { TitleContainer } from "../styled/containers/titleContainer";

const Wrapper = styled(PrimaryCard)`
  margin: 16px 0;

  div:last-child {
    border-bottom: none;
  }
`;

const Title = styled(TitleContainer)`
  span {
    display: inline-flex;
    align-items: center;
    font-weight: bold;
  }

  svg {
    cursor: pointer;
  }
`;

const Items = styled.article`
  display: ${(props) => (props.show ? "block" : "none")};
  margin-top: 16px;
`;

function Accordion({ children, title, showFold = true }) {
  const [fold, setFold] = useState(false);

  return (
    <Wrapper>
      <Title>
        <span>{title}</span>
        {showFold && (
          <span onClick={() => setFold(!fold)}>
            <Caret size={16} isGrey={true} down={fold} />
          </span>
        )}
      </Title>
      <Items show={!fold}>{children}</Items>
    </Wrapper>
  );
}

export default memo(Accordion);
