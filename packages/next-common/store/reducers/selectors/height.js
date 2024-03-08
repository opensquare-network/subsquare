import { createSelector } from "@reduxjs/toolkit";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { nodesHeightSelector } from "next-common/store/reducers/nodeSlice";
import { isNil } from "lodash-es";

const chainOrScanHeightSelector = createSelector(
  latestHeightSelector,
  nodesHeightSelector,
  (chainHeight, scanHeight) => {
    return isNil(chainHeight) ? scanHeight : chainHeight;
  },
);

export default chainOrScanHeightSelector;
