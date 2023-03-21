import React from "react";
import styled from "styled-components";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.secondaryYellow500};
  background-color: ${(p) => p.theme.secondaryYellow100};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 16px;
`;

const WarningText = styled.div`
  line-height: 18px;
`;

const IconWrapper = styled.div`
  display: inline-block;
  position: relative;
  top: 3px;
  margin-right: 8px;
`;

export default function MaliciousHead() {
  return (
    <Wrapper>
      <WarningText>
        <IconWrapper>
          <WarningIcon />
        </IconWrapper>
        Warning: Malicious proposal! Some of the external links below have been
        flagged as scams.
      </WarningText>
    </Wrapper>
  );
}
