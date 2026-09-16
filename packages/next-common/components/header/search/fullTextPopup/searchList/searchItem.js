import { ItemType } from "next-common/components/header/search/utils/items";
import { FULL_TEXT_COMMENTS_TYPE } from "next-common/components/header/search/utils/fullTextSections";
import OriginalSearchItem from "next-common/components/header/search/popup/searchList/searchItem";
import CommentSearchItem, {
  CommentSearchItemCategory,
} from "./commentSearchItem";

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
