import styled, { css } from "styled-components";
import TimelineItemInfo from "./itemInfo";

const NavigationLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
`;

const TopLine = styled.div`
  width: 2px;
  height: 4px;
  margin-bottom: 4px;
  ${(p) =>
    !p.isFirst &&
    css`
      background-color: var(--theme300);
    `}
`;

const BottomLine = styled.div`
  width: 2px;
  margin-top: 4px;
  flex-grow: 1;
  ${(p) =>
    !p.isLast &&
    css`
      background-color: var(--theme300);
    `}
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Circle = styled.div`
  height: 12px;
  width: 12px;
  border: 3px solid var(--theme500);
  border-radius: 50%;
  margin: 4px 0;
`;

export default function TimelineItem({
  data,
  item,
  isFirst,
  isLast,
  FieldsComponent,
}) {
  return (
    <div className="flex">
      <NavigationLine>
        <TopLine isFirst={isFirst} />
        <Circle />
        <BottomLine isLast={isLast} />
      </NavigationLine>
      <InfoPanel>
        <TimelineItemInfo
          data={data}
          item={item}
          FieldsComponent={FieldsComponent}
        />
        {!isLast && <div className="h-[16px]" />}
      </InfoPanel>
    </div>
  );
}
