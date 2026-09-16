import { ItemType } from "next-common/components/header/search/utils/items";
import { FULL_TEXT_COMMENTS_TYPE } from "next-common/components/header/search/utils/fullTextSections";
import OriginalSearchItem from "next-common/components/header/search/popup/searchList/searchItem";
import CommentSearchItem, {
  CommentSearchItemCategory,
} from "./commentSearchItem";

// The full text search dialog renders the rows with the same item components
// as the index based search dialog, only the comments of the full text search
// results have an extra type of their own.
function SearchItem({ row, onClose }) {
  if (row.proposalType === FULL_TEXT_COMMENTS_TYPE) {
    if (row.type === ItemType.CATEGORY) {
      return <CommentSearchItemCategory title={row.title} />;
    }
    return <CommentSearchItem row={row} onClose={onClose} />;
  }

  return <OriginalSearchItem row={row} onClose={onClose} />;
}

export default SearchItem;
