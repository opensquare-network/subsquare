import styled from "styled-components";
import React, { memo, useState } from "react";
import { timeDurationFromNow } from "../../utils";
import Caret from "../icons/caret";
import { PrimaryCard } from "../styled/containers/primaryCard";

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  div.title {
    > :first-child {
      font-weight: bold;
      font-size: 16px;
    }

    > :last-child {
      margin-left: 12px;
      font-size: 12px;
      color: ${(props) => props.theme.textTertiary};
      display: inline-flex;
    }
  }

  & > span:last-child {
    cursor: pointer;
  }
`;

const Detail = styled.article`
  display: ${(props) => (props.show ? "block" : "none")};
  margin-top: 24px;
`;

function TimelineAccordion({
  motionEndInfo = null,
  lastActivityTime = 0,
  children,
}) {
  const [fold, setFold] = useState(false);

  return (
    <PrimaryCard>
      <TitleWrapper>
        <div className="title">
          <span>Timeline</span>
          <span>
            {motionEndInfo ||
              `Latest activity ${timeDurationFromNow(lastActivityTime)}`}
          </span>
        </div>
        <span onClick={() => setFold(!fold)}>
          <Caret size={16} isGrey={true} down={fold} />
        </span>
      </TitleWrapper>

      <Detail show={!fold}>{children}</Detail>
    </PrimaryCard>
  );
}

export default memo(TimelineAccordion);
