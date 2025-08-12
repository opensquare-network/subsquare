import { useMemo } from "react";
import Tooltip from "next-common/components/tooltip";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import TooltipContent from "./bubbleTooltipContent";

const sideLength = 16;

export default function BubbleItem({
  leftPositionPercent,
  bottomPositionPercent,
  type,
  who,
  data,
}) {
  const style = useMemo(() => {
    return {
      left: `calc(${leftPositionPercent} - ${sideLength / 2}px)`,
      bottom: `calc(${bottomPositionPercent} - ${sideLength / 2}px)`,
      width: `${sideLength}px`,
      height: `${sideLength}px`,
    };
  }, [bottomPositionPercent, leftPositionPercent]);
  const [avatar] = useAvatarInfo(who);

  return (
    <div
      style={style}
      className="absolute flex bg-red-200 rounded-full pointer-events-auto cursor-pointer overflow-hidden hover:scale-110 hover:z-10"
    >
      <Tooltip
        className={"inline-flex"}
        contentClassName={"pointer-events-auto"}
        content={<TooltipContent who={who} data={data} type={type} />}
      >
        <AvatarDisplay address={who} avatarCid={avatar} size={sideLength} />
      </Tooltip>
    </div>
  );
}
