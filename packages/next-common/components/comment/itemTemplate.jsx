import { forwardRef } from "react";
import Divider from "../styled/layout/divider";
import { cn } from "next-common/utils";
import { noop } from "lodash-es";
import Duration from "../duration";
import { useComment } from "./context";
import VoteTag from "./voteTag";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

const CommentItemTemplate = forwardRef(function Comp(
  {
    isSecondLevel,
    showReplies = false,
    setShowReplies = noop,

    className = "",
    user,
    commentSource,
    content,
    actions,
    highlight,
    renderReplyItem = noop,
    ...props
  },
  ref,
) {
  const chain = useChain();
  const comment = useComment();

  const showCommentSource = [
    Chains.polkadot,
    Chains.kusama,
    Chains.collectives,
  ].includes(chain);

  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        "group/comment-item first:mt-0",
        isSecondLevel ? "mt-4" : "mt-8",
        highlight &&
          cn(
            "bg-neutral200 -mx-12 px-12 py-4 !mt-4",
            "max-md:-mx-6 max-md:px-6",
            isSecondLevel && cn("-ml-4 pl-4", "max-md:-ml-4 max-md:pl-4"),
          ),
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between flex-wrap min-h-[28px]">
        <div className="flex gap-[8px] items-center">
          {user}
          <VoteTag />
        </div>
        <div className="flex items-center">
          <p className="text12Medium text-textTertiary">
            <Duration time={comment.createdAt} />
          </p>
          {showCommentSource && commentSource}
        </div>
      </div>

      <div className="!mt-2 !ml-7">
        {content}
        {comment.createdAt !== comment.updatedAt && (
          <p className="mt-2 text12Medium text-textTertiary">Edited</p>
        )}
      </div>

      {actions && <div className="mt-4 ml-7">{actions}</div>}

      {comment.replies?.length > 0 && (
        <div className="mt-4 ml-7 pl-4 border-l-[3px] border-neutral300">
          <div>
            <button
              className="text-textSecondary hover:text-textPrimary text14Medium"
              onClick={() => {
                setShowReplies(!showReplies);
              }}
            >
              {showReplies
                ? "Hide Replies"
                : `${comment.replies?.length} Replies`}
            </button>
          </div>

          {showReplies && comment.replies?.map?.(renderReplyItem)}
        </div>
      )}

      {!isSecondLevel && (
        <Divider
          className={cn(
            "group-last/comment-item:hidden",
            "ml-7 relative top-4",
          )}
        />
      )}
    </div>
  );
});

export default CommentItemTemplate;
