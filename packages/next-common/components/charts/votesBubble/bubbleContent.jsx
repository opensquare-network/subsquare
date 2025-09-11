import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import VoteBubbleHoverContent from "./hoverContent";
import { useRouter } from "next/router";
import AddressUser from "next-common/components/user/addressUser";

// if `d` less than this value, don't render address/identity
const CONTENT_MIN_SIZE = 60;

export default function VoteBubbleContent({ node, sizeField }) {
  const router = useRouter();
  const d = node.r * 2;

  return (
    <Tooltip
      className={cn("!block h-full w-full rounded-full")}
      content={<VoteBubbleHoverContent node={node} sizeField={sizeField} />}
    >
      <div
        role="link"
        className={cn(
          "flex items-center justify-center cursor-pointer",
          "rounded-full w-full h-full px-2",
        )}
        onClick={() => {
          router.push(`/user/${node.data.account}/votes`);
        }}
      >
        {d >= CONTENT_MIN_SIZE && (
          <AddressUser
            add={node.data.account}
            showAvatar={false}
            maxWidth={d - 12}
            noEvent
            noTooltip
            ellipsis={false}
            link="/votes"
            className={cn(
              "text14Medium",
              node.data.aye && "text-[var(--green500)]",
              node.data.aye === false && "text-[var(--red500)]",
              node.data.isAbstain && "text-[var(--textSecondary)]",
            )}
          />
        )}
      </div>
    </Tooltip>
  );
}
