import { isNil } from "lodash-es";
import { usePost } from "../../../../context/post";
import Info from "../../../styled/info";
import { SystemComment } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export default function CommentsMeta() {
  const post = usePost();
  const noCommentsCount =
    isNil(post.commentsCount) && isNil(post.polkassemblyCommentsCount);
  let commentsCount = post.commentsCount || 0;
  const currentChain = useChain();
  if (
    [Chains.kusama, Chains.kusamaPeople].includes(currentChain) &&
    post.polkassemblyCommentsCount
  ) {
    commentsCount = post.polkassemblyCommentsCount || 0;
  }

  if (noCommentsCount || commentsCount < 0) {
    return null;
  }
  return (
    <Info>
      <Tooltip
        content={`${commentsCount} comments`}
        className="flex cursor-pointer"
      >
        <SystemComment className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
        {commentsCount}
      </Tooltip>
    </Info>
  );
}
