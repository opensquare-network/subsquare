import { forwardRef } from "react";
import Divider from "../styled/layout/divider";
import clsx from "clsx";
import RichTextStyleWrapper from "../content/richTextStyleWrapper";
import noop from "lodash.noop";
import Duration from "../duration";
import { useComment } from "./context";

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
  const comment = useComment();

  return (
    <div
      ref={ref}
      className={clsx(
        "relative",
        "group/comment-item first:mt-0",
        isSecondLevel ? "mt-4" : "mt-8",
        highlight &&
          clsx(
            "bg-neutral200 -mx-12 px-12 py-4 !mt-4",
            "max-md:-mx-6 max-md:px-6",
            isSecondLevel && clsx("-ml-4 pl-4", "max-md:-ml-4 max-md:pl-4"),
          ),
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between flex-wrap min-h-[28px]">
        {user}
        <div className="flex items-center">
          <p className="text12Medium text-textTertiary">
            <Duration time={comment.createdAt} />
          </p>
          {commentSource}
        </div>
      </div>

      <RichTextStyleWrapper className="!mt-2 !ml-7">
        {content}
        {comment.createdAt !== comment.updatedAt && (
          <p className="mt-2 text12Medium text-textTertiary">Edited</p>
        )}
      </RichTextStyleWrapper>

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
          className={clsx(
            "group-last/comment-item:hidden",
            "ml-7 relative top-4",
          )}
        />
      )}
    </div>
  );
});

export default CommentItemTemplate;
