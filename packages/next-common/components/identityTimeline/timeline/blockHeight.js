import tw from "tailwind-styled-components";
import InfoBlock from "@osn/icons/subsquare/InfoBlock";
import { cn } from "next-common/utils";

const BlockIcon = tw(InfoBlock)`
  mr-[4px]
  w-[16px]
  h-[16px]
  [&_path]:stroke-textTertiary
`;

export default function BlockHeight({ number, contentClassName = "" }) {
  return (
    <div className="flex items-center text12Medium">
      <BlockIcon />
      <div className={cn("text-textTertiary", contentClassName)}>{number}</div>
    </div>
  );
}
