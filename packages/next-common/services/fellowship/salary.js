import { defaultPageSize } from "next-common/utils/constants";
import nextApi from "../nextApi";
import { fellowshipSalaryFeedsApi } from "../url";

export function fetchFellowshipSalaryFeeds(
  page = 1,
  pageSize = defaultPageSize,
  opts = {},
) {
  return nextApi.fetch(fellowshipSalaryFeedsApi, {
    page,
    page_size: pageSize,
    ...opts,
  });
}
