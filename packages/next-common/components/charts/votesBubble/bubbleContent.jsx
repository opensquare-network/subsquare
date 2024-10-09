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
            linkToVotesPage
            color={cn(
              node.data.aye && "var(--green500)!important",
              node.data.aye === false && "var(--red500)!important",
              node.data.isAbstain && "var(--textSecondary)!important",
            )}
          />
        )}
      </div>
    </Tooltip>
  );
}
