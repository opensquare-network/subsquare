import CommonSearchItem from "next-common/components/header/search/popup/searchList/commonSearchItem";
import CommentIcon from "./commentIcon";

function CommentSearchItem({ row, onClose }) {
  return (
    <CommonSearchItem
      IconComponent={CommentIcon}
      title={row.title}
      content={row.content}
      contentHighlight={row.highlight?.content}
      href={row.path}
      onClose={onClose}
    />
  );
}

export function CommentSearchItemCategory({ title }) {
  return (
    <div className="h-9 px-2 py-2.5 rounded-[6px] flex items-center text12Medium text-textTertiary">
      {title}
    </div>
  );
}

export default CommentSearchItem;
