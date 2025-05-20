import React, { useMemo } from "react";
import { gov2CategoryIconMap, fellowshipCategoryIconMap } from "./consts";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";

function CategoryIcon({ category }) {
  const listPageType = useListPageType();
  const iconsDisplay = useMemo(() => {
    if (listPageType === listPageCategory.REFERENDA) {
      return gov2CategoryIconMap;
    }
    if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
      return fellowshipCategoryIconMap;
    }
  }, [listPageType]);

  return <p className="ml-2 mt-3">{iconsDisplay?.[category]}</p>;
}

export default React.memo(CategoryIcon);
