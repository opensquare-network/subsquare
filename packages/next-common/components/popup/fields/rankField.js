import React from "react";
import { noop } from "lodash-es";
import CommonSelectField from "./commonSelectField";

export default function RankField({
  title = "Rank",
  rank,
  setRank = noop,
  readOnly,
}) {
  const options = [1, 2, 3, 4, 5, 6].map((r) => {
    return {
      text: r,
      value: r,
    };
  });

  return (
    <CommonSelectField
      title={title}
      value={rank}
      setValue={setRank}
      options={options}
      readOnly={readOnly}
    />
  );
}
