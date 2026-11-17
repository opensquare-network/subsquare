// Keep in sync with MIN_COMMENTS_FOR_AI_SUMMARY and
// MIN_COMMENT_TEXT_LENGTH_FOR_AI_SUMMARY in
// backend-common/services/ai-summary/commentsSummary.js
export const MIN_COMMENTS_FOR_AI_SUMMARY = 5;
export const MIN_COMMENT_TEXT_LENGTH_FOR_AI_SUMMARY = 1000;

const base64ImageRegex = /!\[(.*?)\]\(data:image\/\w+;base64,.*?\)/g;
const htmlTagRegex = /<[^>]*>/g;

export function getCommentContentLength(comment) {
  const content = comment?.content || "";

  if (comment?.contentType === "html") {
    return content.replace(htmlTagRegex, "").length;
  }

  if (comment?.contentType === "markdown") {
    return content.replace(base64ImageRegex, "$1").length;
  }

  return 0;
}

export function getCommentsSummaryStats(comments = [], postType) {
  let count = 0;
  let textLength = 0;

  const walk = (items) => {
    for (const item of items || []) {
      if (postType && item?.[postType] && !item.spam) {
        count += 1;
        textLength += getCommentContentLength(item);
      }
      walk(item?.replies);
    }
  };

  walk(comments);
  return { count, textLength };
}

export function shouldShowCommentsAiSummary(comments, postType) {
  const { count, textLength } = getCommentsSummaryStats(comments, postType);
  return (
    count >= MIN_COMMENTS_FOR_AI_SUMMARY &&
    textLength >= MIN_COMMENT_TEXT_LENGTH_FOR_AI_SUMMARY
  );
}
