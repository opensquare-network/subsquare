import React from "react";
import Tag from "next-common/components/tags/state/tag";
import businessCategory from "next-common/utils/consts/business/category";
import { isNil } from "lodash-es";

function RowStatus({ state }) {
  if (isNil(state)) return null;

  return (
    <Tag state={state} category={businessCategory.treasuryChildBounties} />
  );
}
export default RowStatus;
