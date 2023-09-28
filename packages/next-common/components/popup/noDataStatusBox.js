import React from "react";

import { GreyPanel } from "../styled/containers/greyPanel";
import NoData from "../noData";
import clsx from "clsx";

export default function NoDataStatusBox({ text }) {
  return (
    <GreyPanel>
      <NoData
        showIcon={false}
        text={text}
        className={clsx("w-full", "!py-4 !px-3")}
      />
    </GreyPanel>
  );
}
