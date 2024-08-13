// substrate/frame/core-fellowship/src/lib.rs
// fn get_salary

import { isNil } from "lodash-es";
import rankToIndex from "./rankToIndex";

export function getRankSalary(salary = [], rank = 0) {
  const idx = rankToIndex(rank);

  if (isNil(idx)) {
    return 0;
  }

  return salary[idx];
}
