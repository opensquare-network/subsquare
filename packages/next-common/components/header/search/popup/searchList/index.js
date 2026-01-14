import { memo } from "react";
import CommonList from "next-common/components/header/search/common/commonList";
import SearchItem from "./searchItem";

function SearchList({ data, isLoading, onClose, isMobile }) {
  return (
    <CommonList
      isMobile={isMobile}
      data={data}
      isLoading={isLoading}
      ItemBox={(props) => <SearchItem {...props} onClose={onClose} />}
      onClose={onClose}
    />
  );
}

export default memo(SearchList);
