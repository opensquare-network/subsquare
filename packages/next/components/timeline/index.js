import styled from "styled-components";
import { Fragment } from "react";

import Item from "./item";
import FoldableItem from "./foldableItem";
import { timeDurationFromNow } from "utils";
import { shadow_100 } from "../../styles/componentCss";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    max-width: 100%;
    padding: 24px;
    border-radius: 0;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  > :first-child {
    font-weight: bold;
    font-size: 16px;
  }
  > :last-child {
    font-size: 12px;
    color: #9da9bb;
  }
`;

export default function Timeline({
  data,
  chain,
  indent = true,
  type = "",
  motionEndInfo = null,
}) {
  if (!data || data?.length === 0) {
    return null;
  }

  let lastTimelineItem = data[data.length - 1];
  if (Array.isArray(lastTimelineItem)) {
    lastTimelineItem = lastTimelineItem[lastTimelineItem.length - 1];
  }
  const lastTimelineItemTime = lastTimelineItem?.indexer?.blockTime;

  return (
    <Wrapper>
      <TitleWrapper>
        <div>Timeline</div>
        <div>
          {motionEndInfo ||
            `Last activity ${timeDurationFromNow(lastTimelineItemTime)}`}
        </div>
      </TitleWrapper>
      {data.map((item, index) => (
        <Fragment key={index}>
          {Array.isArray(item) ? (
            <FoldableItem
              data={item}
              chain={chain}
              indent={indent}
              type={type}
            />
          ) : (
            <Item data={item} chain={chain} type={type} />
          )}
        </Fragment>
      ))}
    </Wrapper>
  );
}
