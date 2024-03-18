import tw from "tailwind-styled-components";
import TimelineItemInfo from "./itemInfo";

const NavigationLine = tw.div`
  flex
  flex-col
  items-center
  mr-[16px]
`;

const TopLine = tw.div`
  w-[2px]
  ${(p) => p.isFirst && "mt-[4px] h-[4px]"}
  ${(p) => !p.isFirst && "h-[8px] bg-theme300"}
`;

const BottomLine = tw.div`
  w-[2px]
  grow
  ${(p) => !p.isLast && "bg-theme300"}
`;

const InfoPanel = tw.div`
  flex
  flex-col
  m-full
`;

const Circle = tw.div`
  h-[12px]
  w-[12px]
  border-[3px]
  border-solid
  border-theme500
  rounded-full
  my-[4px]
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
