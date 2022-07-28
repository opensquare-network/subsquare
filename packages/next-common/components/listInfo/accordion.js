import React, { memo, useState } from "react";
import styled from "styled-components";
import Caret from "../icons/caret";
import { PrimaryCard } from "../styled/containers/primaryCard";

const Wrapper = styled(PrimaryCard)`
  margin: 16px 0;

  div:last-child {
    border-bottom: none;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.textPrimary};

  span {
    font-weight: bold;
    font-size: 16px;
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
