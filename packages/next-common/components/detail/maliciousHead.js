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
  gap: 8px;
  padding: 10px;
  margin-bottom: 16px;
`;

export default function MaliciousHead() {
  return (
    <Wrapper>
      <div>
        <WarningIcon />
      </div>
      <span>
        Warning: Malicious proposal! Some of the external links below have been
        flagged as scams.
      </span>
    </Wrapper>
  );
}
