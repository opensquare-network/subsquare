import { SystemComment } from "@osn/icons/subsquare";
import CommonSearchItem from "next-common/components/header/search/popup/searchList/commonSearchItem";

// A comment of the full text search results. The title locates the post the
// comment belongs to, the content is the matched snippet of the comment, and
// the link jumps to the comment in the detail page of that post.
function CommentSearchItem({ row, onClose }) {
  return (
    <CommonSearchItem
      IconComponent={SystemComment}
      title={row.title}
      content={row.content}
      contentHighlight={row.highlight?.content}
      href={row.path}
      onClose={onClose}
    />
  );
}

// The category of the comments of the full text search results. There is no
// page listing the comments, so it is not clickable.
export function CommentSearchItemCategory({ title }) {
  return (
    <div className="h-9 px-2 py-2.5 rounded-[6px] flex items-center text12Medium text-textTertiary">
      {title}
    </div>
  );
}

export default CommentSearchItem;
