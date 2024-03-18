import dayjs from "dayjs";
import tw from "tailwind-styled-components";
import InfoTime from "@osn/icons/subsquare/InfoTime";
import Duration from "next-common/components/duration";

const ClockIcon = tw(InfoTime)`
  mr-[4px]
  w-[16px]
  h-[16px]
  [&_path]:fill-textTertiary
`;

export default function BlockTime({ ts }) {
  return (
    <div className="flex items-center text12Medium whitespace-nowrap">
      <ClockIcon />
      <div className="mr-[4px] text-textTertiary">
        {dayjs(ts).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <div className="text-textDisabled">
        <Duration time={ts} />
      </div>
    </div>
  );
}
