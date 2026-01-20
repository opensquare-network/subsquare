import { useMemo } from "react";
import Tooltip from "next-common/components/tooltip";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import TooltipContent from "./bubbleTooltipContent";
import { cn } from "next-common/utils";

const sideLength = 16;

export default function FellowshipBubbleItem({
  leftPositionPercent,
  bottomPositionPercent,
  rank,
  formatData,
  hidden,
}) {
  const { account } = formatData || {};
  const style = useMemo(() => {
    return {
      left: `calc(${leftPositionPercent} - ${sideLength / 2}px)`,
      bottom: `calc(${bottomPositionPercent} - ${sideLength / 2}px)`,
      width: `${sideLength}px`,
      height: `${sideLength}px`,
    };
  }, [bottomPositionPercent, leftPositionPercent]);
  const [avatar] = useAvatarInfo(account);

  return (
    <div
      style={style}
      className={cn(
        "absolute flex bg-red-200 rounded-full pointer-events-auto cursor-pointer overflow-hidden hover:z-10 transition-all",
        hidden && "hidden",
      )}
    >
      <Tooltip
        className={"inline-flex"}
        contentClassName={"pointer-events-auto"}
        content={<TooltipContent formatData={formatData} rank={rank} />}
      >
        <AvatarDisplay address={account} avatarCid={avatar} size={sideLength} />
      </Tooltip>
    </div>
  );
}
